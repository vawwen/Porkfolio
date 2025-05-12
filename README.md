# Porkfolio

**HKUST COMP 4521 Final Project**

![Porkfolio Logo](./mobile/assets/images/logo-white-bg.png)

## Welcome to Porkfolio!

Porkfolio is an innovative application designed to help you manage your finances effectively.

## Front-end Setup

To run this project, follow these steps:

1. Clone the repository to your device:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the repository folder:
   ```bash
   cd mobile
   ```
3. Install all necessary packages:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npx expo
   ```
5. Open **Expo Go** on your mobile device and scan the QR code.
6. Register or log in to start using Porkfolio!

## Back-end Setup

If you followed the front-end setup, the application is ready to go. However, if you want to use localhost instead, you can follow these steps:

1. Navigate to the repository folder:
   ```bash
   cd backend
   ```
2. Install all necessary packages:
   ```bash
   npm install
   ```
3. Insert provided **.env** file to the backend folder.
4. Start the backend:
   ```bash
   npm run dev
   ```
5. Navigate to `Porkfolio\mobile\constants\api.js` and change the **API_URL** to `http://localhost:3001/api`
6. Register or log in to start using Porkfolio!

## Features

- **User Registration**: Create a new account or log in.
- **Expense Tracking**: Easily manage your expenses.
- **"Wallets" for Budget Management**: Set spending limits and track your budgets.
- **Custom transaction types**: Customize transaction types using the user menu.
- **Expense Analytics**: Gain insights on your expense and income.

## Contributing

Project made by HANSEN, Varren and SURJADI, Darryl Edward

---

Thank you for using Porkfolio! Happy budgeting!
