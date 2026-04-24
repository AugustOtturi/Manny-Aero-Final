export interface ISBHAModule {
  id: string;
  badge: string;
  title: string;
  items: string[];
  note?: string;
}

export const ISBHA_MODULES: ISBHAModule[] = [
  {
    id: "organization",
    badge: "Module 1",
    title: "Organization & Management",
    items: [
      "Documented organizational structure with clear lines of responsibility for ground handling operations.",
      "Accountable manager formally designated and authorized to make operational decisions.",
      "Written policies covering safety, quality, security, and environmental responsibility.",
      "Regular management review meetings with documented minutes and corrective action tracking.",
    ],
    note: "Manny Aero maintains a three-tier management structure across all served airports, with a named accountable manager reporting directly to operations leadership.",
  },
  {
    id: "sms",
    badge: "Module 2",
    title: "Safety Management System (SMS)",
    items: [
      "Formal SMS documented and implemented in line with ICAO Annex 19 requirements.",
      "Hazard identification and risk assessment conducted for all ramp activities.",
      "Confidential safety reporting system accessible to all operational staff.",
      "Safety performance indicators tracked monthly with trend analysis.",
      "Emergency response plan tested at least annually with tabletop or live exercises.",
    ],
  },
  {
    id: "training",
    badge: "Module 3",
    title: "Training & Personnel Competency",
    items: [
      "Documented training program with initial and recurrent modules for every operational role.",
      "Competency verification via practical assessment before unsupervised duty.",
      "Training records retained for a minimum of 3 years, available for audit inspection.",
      "Human factors and fatigue management training for ramp and customer-facing staff.",
      "English proficiency requirements for supervisors at international FBOs.",
    ],
    note: "Our ramp agents complete 40+ hours of initial training before first unsupervised shift, plus quarterly recurrent modules.",
  },
  {
    id: "ramp",
    badge: "Module 4",
    title: "Ramp & Ground Handling Operations",
    items: [
      "Standard operating procedures for aircraft marshalling, chocking, and towing.",
      "Foreign Object Debris (FOD) prevention program with scheduled sweeps and inspections.",
      "GSE (Ground Support Equipment) inspection and maintenance records retained.",
      "Walk-around procedures documented for pre- and post-service aircraft checks.",
      "Adverse weather procedures for high wind, rain, and low visibility operations.",
    ],
  },
  {
    id: "fueling",
    badge: "Module 5",
    title: "Fueling Operations",
    items: [
      "Fuel quality control program aligned with ATA 103 / JIG standards.",
      "Daily fuel sampling and testing with logs retained for 12 months.",
      "Bonding and grounding procedures documented and trained for all refueling staff.",
      "Fuel truck inspection and filter replacement schedule maintained.",
      "Spill response equipment and procedures in place at every fueling location.",
    ],
    note: "Where Manny Aero does not directly operate fueling, we contract only with ATA 103 / JIG compliant suppliers and verify their records annually.",
  },
  {
    id: "security",
    badge: "Module 6",
    title: "Security & Access Control",
    items: [
      "Aircraft access restricted to authorized personnel with documented verification procedures.",
      "Background check requirements for all ramp and customer-facing staff.",
      "Secure storage for crew belongings and passenger effects when aircraft is unattended.",
      "Coordination with airport security and local law enforcement per station requirements.",
      "Incident reporting procedures for security events with defined escalation paths.",
    ],
  },
];
