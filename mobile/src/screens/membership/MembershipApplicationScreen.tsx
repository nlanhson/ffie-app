// Membership application form — Karim's lead-capture surface.
//
// Reached from the Join-FFIE screen's "Apply for membership" CTA (opened as a
// slide-up modal by the guest shell). Collects the minimum FFIE needs to
// review eligibility and confirm a rate: company identity (name + SIRET),
// a contact, an email to reply to, and an optional company size that drives
// the dues band. No payment is taken — submitting hands off to the
// confirmation/pending screen.
//
// Validation runs on submit (not per-keystroke): required fields must be
// present, SIRET must be 14 digits, email must look like an email, and the
// eligibility box must be ticked. Errors surface inline via the Input's
// error slot. The submit button shows a brief loading state so the handoff
// to the confirmation screen doesn't feel instant/unreal.

import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Check, ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import type { ApplicationInput, CompanySize } from "@/auth/membershipContext";

const SIZE_OPTIONS: { key: CompanySize; label: string }[] = [
  { key: "1-5", label: "1–5" },
  { key: "6-20", label: "6–20" },
  { key: "21-50", label: "21–50" },
  { key: "50+", label: "50+" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = "companyName" | "siret" | "contactName" | "email" | "consent";
type Errors = Partial<Record<FieldKey, string>>;

export function MembershipApplicationScreen({
  themeName = "light",
  onBack,
  onSubmit,
}: {
  themeName?: ThemeName;
  onBack: () => void;
  onSubmit: (input: ApplicationInput) => void;
}) {
  const t = themes[themeName];

  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companySize, setCompanySize] = useState<CompanySize | undefined>(undefined);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!companyName.trim()) e.companyName = "Enter your company name.";
    const siretDigits = siret.replace(/\s/g, "");
    if (!siretDigits) e.siret = "Enter your SIRET number.";
    else if (!/^\d{14}$/.test(siretDigits)) e.siret = "The SIRET has 14 digits.";
    if (!contactName.trim()) e.contactName = "Enter a contact name.";
    if (!email.trim()) e.email = "Enter an email address.";
    else if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (!consent) e.consent = "Please confirm before submitting.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    // Simulate the network round-trip so the CTA shows its loading state
    // before the flow swaps to the confirmation screen.
    setTimeout(() => {
      onSubmit({
        companyName: companyName.trim(),
        siret: siret.replace(/\s/g, ""),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        companySize,
      });
    }, 700);
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            columnGap: 1,
            alignSelf: "flex-start",
            paddingVertical: 8,
            paddingHorizontal: 12,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <ChevronLeft size={26} color={t.brand.accent} />
          <Text style={{ color: t.brand.accent, fontSize: 16 }}>Back</Text>
        </Pressable>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: displayFamily("700"),
              fontWeight: "700",
              color: t.text.body,
              letterSpacing: -0.5,
            }}
          >
            Membership application
          </Text>
          <Text style={{ fontSize: 15, color: t.text.muted, marginTop: 8, lineHeight: 22 }}>
            Tell us about your company. FFIE reviews each application and confirms your
            annual dues by email — no payment is required at this stage.
          </Text>

          <View style={{ marginTop: 24, rowGap: 16 }}>
            <Input
              label="Company name"
              required
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="e.g. Marchand Electrical"
              error={errors.companyName}
              themeName={themeName}
              returnKeyType="next"
            />
            <Input
              label="SIRET"
              required
              value={siret}
              onChangeText={setSiret}
              placeholder="14-digit company number"
              helperText="Used to verify that your company is registered in France."
              error={errors.siret}
              themeName={themeName}
              returnKeyType="next"
            />
            <Input
              label="Contact name"
              required
              value={contactName}
              onChangeText={setContactName}
              placeholder="Your full name"
              error={errors.contactName}
              themeName={themeName}
              returnKeyType="next"
            />
            <Input
              label="Email address"
              required
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.fr"
              helperText="We'll send the status of your application to this address."
              error={errors.email}
              themeName={themeName}
              returnKeyType="next"
            />
            <Input
              label="Phone number (optional)"
              value={phone}
              onChangeText={setPhone}
              placeholder="Optional"
              themeName={themeName}
              returnKeyType="done"
            />

            {/* Company size — optional segmented chips. Drives the dues band. */}
            <View>
              <Text
                style={{
                  color: t.text.body,
                  fontSize: 13,
                  fontFamily: ralewayFamily("600"),
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                Company size (optional)
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 8, rowGap: 8 }}>
                {SIZE_OPTIONS.map((opt) => {
                  const sel = companySize === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      accessibilityRole="button"
                      accessibilityState={{ selected: sel }}
                      accessibilityLabel={`${opt.label} employees`}
                      onPress={() => setCompanySize(sel ? undefined : opt.key)}
                      style={({ pressed }) => ({
                        paddingHorizontal: 16,
                        height: 40,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: sel
                          ? t.brand.accent
                          : pressed ? t.border.subtle : t.surface.subtle,
                        borderWidth: 1,
                        borderColor: sel ? t.brand.accent : t.border.subtle,
                      })}
                    >
                      <Text
                        style={{
                          color: sel ? "#FFFFFF" : t.text.body,
                          fontSize: 14,
                          fontFamily: ralewayFamily(sel ? "600" : "500"),
                          fontWeight: sel ? "600" : "500",
                        }}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={{ color: t.text.muted, fontSize: 12, marginTop: 8, lineHeight: 17 }}>
                Annual dues depend on the company size. FFIE confirms your exact rate during the review.
              </Text>
            </View>

            {/* Eligibility consent — required to submit. */}
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consent }}
              accessibilityLabel="I confirm that my company is registered in France and that the information is accurate"
              onPress={() => {
                setConsent((v) => !v);
                if (errors.consent) setErrors((e) => ({ ...e, consent: undefined }));
              }}
              style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 10, paddingVertical: 4 }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  borderWidth: 2,
                  marginTop: 1,
                  borderColor: errors.consent
                    ? t.feedback.danger
                    : consent ? t.brand.accent : t.border.strong,
                  backgroundColor: consent ? t.brand.accent : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {consent ? <Check size={15} color="#FFFFFF" strokeWidth={3} /> : null}
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: errors.consent ? t.feedback.danger : t.text.muted,
                  lineHeight: 19,
                }}
              >
                I confirm that my company is registered in France and that the information above is accurate.
              </Text>
            </Pressable>

            <Button
              themeName={themeName}
              size="lg"
              fullWidth
              loading={submitting}
              disabled={submitting}
              onPress={handleSubmit}
              accessibilityLabel="Submit membership application"
            >
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
