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
    if (!companyName.trim()) e.companyName = "Saisissez le nom de votre entreprise.";
    const siretDigits = siret.replace(/\s/g, "");
    if (!siretDigits) e.siret = "Saisissez votre numéro SIRET.";
    else if (!/^\d{14}$/.test(siretDigits)) e.siret = "Le SIRET comporte 14 chiffres.";
    if (!contactName.trim()) e.contactName = "Saisissez le nom d'un contact.";
    if (!email.trim()) e.email = "Saisissez une adresse e-mail.";
    else if (!EMAIL_RE.test(email.trim())) e.email = "Saisissez une adresse e-mail valide.";
    if (!consent) e.consent = "Veuillez confirmer avant d'envoyer.";
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
          accessibilityLabel="Retour"
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
          <Text style={{ color: t.brand.accent, fontSize: 16 }}>Retour</Text>
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
            Demande d'adhésion
          </Text>
          <Text style={{ fontSize: 15, color: t.text.muted, marginTop: 8, lineHeight: 22 }}>
            Parlez-nous de votre entreprise. La FFIE examine chaque demande et confirme votre
            cotisation annuelle par e-mail — aucun paiement n'est demandé pour le moment.
          </Text>

          <View style={{ marginTop: 24, rowGap: 16 }}>
            <Input
              label="Nom de l'entreprise"
              required
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="ex. Marchand Électricité"
              error={errors.companyName}
              themeName={themeName}
              returnKeyType="next"
            />
            <Input
              label="SIRET"
              required
              value={siret}
              onChangeText={setSiret}
              placeholder="Numéro d'entreprise à 14 chiffres"
              helperText="Permet de vérifier que votre entreprise est enregistrée en France."
              error={errors.siret}
              themeName={themeName}
              returnKeyType="next"
            />
            <Input
              label="Nom du contact"
              required
              value={contactName}
              onChangeText={setContactName}
              placeholder="Votre nom complet"
              error={errors.contactName}
              themeName={themeName}
              returnKeyType="next"
            />
            <Input
              label="Adresse e-mail"
              required
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="vous@entreprise.fr"
              helperText="Nous vous enverrons le statut de votre demande à cette adresse."
              error={errors.email}
              themeName={themeName}
              returnKeyType="next"
            />
            <Input
              label="Numéro de téléphone (facultatif)"
              value={phone}
              onChangeText={setPhone}
              placeholder="Facultatif"
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
                Taille de l'entreprise (facultatif)
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 8, rowGap: 8 }}>
                {SIZE_OPTIONS.map((opt) => {
                  const sel = companySize === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      accessibilityRole="button"
                      accessibilityState={{ selected: sel }}
                      accessibilityLabel={`${opt.label} salariés`}
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
                La cotisation annuelle dépend de la taille de l'entreprise. La FFIE confirme votre tarif exact lors de l'examen.
              </Text>
            </View>

            {/* Eligibility consent — required to submit. */}
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consent }}
              accessibilityLabel="Je confirme que mon entreprise est enregistrée en France et que les informations sont exactes"
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
                Je confirme que mon entreprise est enregistrée en France et que les informations ci-dessus sont exactes.
              </Text>
            </Pressable>

            <Button
              themeName={themeName}
              size="lg"
              fullWidth
              loading={submitting}
              disabled={submitting}
              onPress={handleSubmit}
              accessibilityLabel="Envoyer la demande d'adhésion"
            >
              {submitting ? "Envoi en cours…" : "Envoyer la demande"}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
