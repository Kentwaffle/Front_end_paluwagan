export const personalInformation = [
  {
    name: "firstName",
    label: "First name",
    placeholderText: "eg. Juan",

    itemType: "input",
  },
  {
    name: "middleName",
    label: "Middle name",
    placeholderText: "eg. Cruz",

    itemType: "input",
  },
  {
    name: "lastName",
    label: "Last name",
    placeholderText: "eg. Dela",
    itemType: "input",
  },
  {
    name: "suffix",
    label: "Suffix name",

    options: ["Jr.", "Sr.", "III", "IV"],
    itemType: "dropdown",
  },
  {
    name: "phoneNumber",
    label: "Phone number",
    placeholderText: "eg. 09000000000",

    itemType: "input",
  },
];

export const accountInformation = [
  {
    name: "email",
    label: "Email",
    placeholderText: "eg. juan@example.com",
    itemType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholderText: "••••••••",
    type: "password",
  },
];
