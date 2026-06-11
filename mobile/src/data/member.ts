// Current (signed-in) member — v1 mock identity.
//
// There is no auth/profile backend in v1 (see CLAUDE.md → "Auth and
// membership are mocked UI"). The member persona is Julien Marchand — the
// same identity ProfileScreen renders — so the app reads coherently wherever
// the signed-in member is shown (Home hero header, Profile card, …).
//
// The membership number is placeholder data, NOT a real FFIE record (the
// "no fabricated real-world data" rule covers federation facts like dues and
// contact details, not the mock account used to preview the member UI). When
// a real session lands, replace this module with data from the profile API.
//
// The same rule governs the company block + qualifications below: the company
// name and SIRET are mock account data (the SIRET is intentionally masked,
// like a "details coming" placeholder), and QUALIFELEC / CONSUEL are the real
// French electrical-trade certification *types* a member would hold — their
// "valid" state here is mock account state, not a fabricated federation fact.

export type MemberStatus = "active" | "pending" | "lapsed";

/** A trade certification the member holds (Profile → Qualifications). */
export type MemberQualification = {
  label: string;
  /** Whether the certification is currently valid (mock account state). */
  valid: boolean;
};

export type MemberProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  /** Monogram for avatars when no photo is set. */
  initials: string;
  /** Federation membership number, shown as "No. {memberNo}". */
  memberNo: string;
  status: MemberStatus;
  /** Human label for the status pill, e.g. "Active member". */
  statusLabel: string;
  /** Job title within the member company (Profile hero). */
  jobTitle: string;
  /** Federation region the member belongs to. */
  region: string;
  /** The member's company — mock account data (see header note). */
  company: {
    /** Registered company name (raison sociale). */
    name: string;
    /** SIRET identifier — masked placeholder until a real session lands. */
    siret: string;
  };
  /** Trade certifications shown in the Profile → Qualifications group. */
  qualifications: MemberQualification[];
};

export const currentMember: MemberProfile = {
  firstName: "Julien",
  lastName: "Marchand",
  fullName: "Julien Marchand",
  initials: "JM",
  memberNo: "04521",
  status: "active",
  statusLabel: "Active member",
  jobTitle: "Technical Manager",
  region: "Île-de-France",
  company: {
    name: "ELEC PRO SAS",
    siret: "814 xxx xxx",
  },
  qualifications: [
    { label: "QUALIFELEC", valid: true },
    { label: "CONSUEL approved", valid: true },
  ],
};
