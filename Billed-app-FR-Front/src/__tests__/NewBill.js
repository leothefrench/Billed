/**
 * @jest -environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom" // Ajout fireEvent (déclenchement action sur DOM) & waitFor (Async)

import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import router from "../app/Router"
import { localStorageMock } from "../__mocks__/localStorage.js"

import { NewBillUI } from "../views/NewBillUI.js"
import { NewBill } from "../containers/NewBill.js"

import mockStore from "../__mocks__/store"

// Récupération des données du store avec la fonction mock() de Jest
jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then icon of mail the vertical Layout must be highlighted", async () => {
      // localStorage - modification de l'objet window avec la méthode defineProperties
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })

      // utilisation de l'accesseur setitem de la fonction localStorageMock
      window.localStorage.setItem('user',  JSON.stringify({ type: 'Employee'}))
      const root = document.createElement('root')
      root.setAttribute('id', 'root')
      document.body.appendChild(root)

      Router();

      // Initialisation du onNavigate
      const onNavigate = (pathname) => { screen.innerHTML = path }
      await waitFor(() => screen.getByTestId('icon-mail'))

      // Check screen has id icon-mail and contains .active icon
      expect(screen.getByTestId('icon-mail')).toBeTruthy();
      expect(screen.getByTestId('icon-mail').classList.contains('active-icon')).toBeTruthy();
    })
  })

  // TEST D'INTEGRATION POST
  describe("When I am on the newBill page, I fill the form and submi it", () => {
    test("Then the new bill should be added to the API POST", async () => {
      // AFFICHAGE USER INTERFACE - NOUVELLE FACTURE - NewBillUI()
      const html = newBillUI()
      document.body.innerHTML = html

      // Initialisation d'une nouvelle facture factice - Document
        const newBill = {
          "id": "qcCK3SzECmaZAGRrHjaC",
          "status": "refused",
          "pct": 20,
          "amount": 200,
          "email": "a@a",
          "name": "test2",
          "vat": "40",
          "fileName": "preview-facture-free-201801-pdf-1.jpg",
          "date": "2002-02-02",
          "commentAdmin": "pas la bonne facture",
          "commentary": "test2",
          "type": "Restaurants et bars",
          "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
        }

      // Ciblage de chaque champs du formulaire & simulation du changement avec fireEvent
      const expenseField =  screen.getByTestId('expense-type')
      fireEvent.change(expenseField, {target: {value: newBill.type} })
      expect(expenseField.value).toBe(newBill.type)
    })
  })
})

  // describe("When I want to upload a proof", () => {
  //   test("Then the file must have the good extension", () => {
  //     // AFFICHAGE USER INTERFACE - NOUVELLE FACTURE - NewBillUI()
  //     const html = NewBillUI()
  //     screen.innerHTML = html

  //     // Création d'une nouvelle facture
  //     const newBill = new newBill({
  //       document,
  //       onNavigate,
  //       store: null,
  //       localStorage: window.localStorage
  //     })

  //     // Utilisation mock function pour fonction handleFileChange()
  //     const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

  //     // Ajout Evenement et query Fire
  //     const inputFile = screen.getByTestId('file');
  //     inputFile.addEventListener('change', handleChangeFile);

  //     // Déclenchement de l'événement
  //     fireEvent.change(inputFile, {
  //       target: {
  //         files: [new file(['image.png'], 'image.png', { type: 'image/png'})]
  //       }
  //     })

  //     // function handleChangeFile have to be called
  //     expect(handleChangeFile).toBeCalled()
  //     // File name should be 'image.png'
  //     expect(inputFile.files[0].name).toBe('image.png')
  //     // Check if the text screen message is 'Envoyer une note de frais'
  //     expect(screen.getByTest('ENvoyer une note de frais').toBeTruthy())
  //     // Check error message in the Dom
  //     expect(html.includes("<div class=\"hideErrorMessage\" id=\"errorFileType\" data-testid=\"errorFile\">")).toBeTruthy();

  //   })
  // })

