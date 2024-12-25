import { nanoid } from "nanoid";

export const signup = [
  {
    type: "email",
    name: "email",
    placeholder: "E-mail",
  },
  {
    type: "text",
    name: "name",
    placeholder: "Name",
  },
  {
    type: "text",
    name: "surname",
    placeholder: "Surname",
  },
  {
    type: "text",
    name: "birthday",
    placeholder: "Date of birth dd.mm.yyyy",
  },
  {
    type: "text",
    name: "address",
    placeholder: "Address",
  },
  {
    type: "text",
    name: "postalCode",
    placeholder: "PostalCode",
  },
  {
    type: "text",
    name: "city",
    placeholder: "City",
  },
  {
    type: "text",
    name: "country",
    placeholder: "Country",
  },
  {
    type: "file",
    name: "image",
    placeholder: "Choose your avatar",
    id: "file",
  },
  {
    type: "text",
    name: "phone",
    placeholder: "Phone",
  },
  {
    type: "select",
    name: "securityQuestion",
    placeholder: "Answer",
    value: [
      "What is your grandfather’s last name?",
      "What’s your home address?",
      "What is your mother’s phone number?",
      "What was the name of your first childhood friend?",
      "What is your brightest childhood dream?",
      "What was the name of your first school teacher?",
      "What color do you like the most?",
      "What book do you recommend to your friends?",
    ],
  },
  {
    type: "text",
    name: "securityAnswer",
    placeholder: "Answer",
  },
  {
    type: "password",
    name: "password",
    placeholder: "Password",
  },
  {
    type: "password",
    name: "password2",
    placeholder: "Confirm the password",
  },
];

export const user = {
  id: "",
  email: "",
  name: "",
  surname: "",
  image: [],
  birthday: "",
  age: "",
  address: "",
  postalCode: "",
  city: "",
  country: "",
  friends: [],
  phone: "",
  security: {
    securityQuestion: "",
    securityAnswer: "",
  },
  password: "",
  isSigned: [
    {
      IP: "",
      date: "",
      deviceId: nanoid(),
      isSigned: false,
    },
  ],
  actions: {
    success: null,
    error: null,
    loading: false,
    checked: false,
  },
};
