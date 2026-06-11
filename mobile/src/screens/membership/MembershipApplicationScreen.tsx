// Formulaire de demande d'adhésion — la surface de captation de leads de Karim.
//
// Atteint depuis le CTA « Demander l'adhésion » de l'écran Rejoindre la FFIE
// (ouvert en modal glissant vers le haut par la coquille invité). Recueille le
// minimum dont la FFIE a besoin pour examiner l'éligibilité et confirmer un
// tarif : l'identité de l'entreprise (raison sociale + SIRET), un contact, un
// e-mail de réponse, et un effectif facultatif qui détermine la tranche de
// cotisation. Aucun paiement n'est pris — l'envoi passe la main à l'écran de
// confirmation/en attente.
//
// La validation se fait à l'envoi (pas à chaque frappe) : les champs obligatoires
// doivent être renseignés, le SIRET doit comporter 14 chiffres, l'e-mail doit
// ressembler à un e-mail, et la case d'éligibilité doit être cochée. Les erreurs
// s'affichent en ligne via le slot d'erreur de l'Input. Le bouton d'envoi montre
// un bref état de chargement pour que le passage à l'écran de confirmation ne
// paraisse pas instantané/irréel.

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
    if (!companyName.trim()) e.companyName = "Saisissez la raison sociale de votre entreprise.";
    const siretDigits = siret.replace(/\s/g, "");
    if (!siretDigits) e.siret = "Saisissez votre numéro de SIRET.";
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
    // Simule l'aller-retour réseau pour que le CTA affiche son état de chargement
    // avant que le flux ne bascule vers l'écran de confirmation.
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
            Parlez-nous de votre entreprise. La FFIE examine chaque demande et confirme
            votre cotisation annuelle par e-mail — aucun paiement n'est requis à ce stade.
          </Text>

          <View style={{ marginTop: 24, rowGap: 16 }}>
            <Input
              label="Raison sociale"
              required
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="ex. Électricité Marchand"
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
              helperText="Sert à vérifier que votre entreprise est immatriculée en France."
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
              helperText="Nous enverrons le statut de votre demande à cette adresse."
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

            {/* Effectif — pastilles segmentées facultatives. Détermine la tranche de cotisation. */}
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
                Effectif (facultatif)
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
                La cotisation annuelle dépend de l'effectif. La FFIE confirme votre tarif exact lors de l'examen.
              </Text>
            </View>

            {/* Consentement d'éligibilité — obligatoire pour envoyer. */}
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consent }}
              accessibilityLabel="Je confirme que mon entreprise est immatriculée en France et que les informations sont exactes"
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
                Je confirme que mon entreprise est immatriculée en France et que les informations ci-dessus sont exactes.
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
