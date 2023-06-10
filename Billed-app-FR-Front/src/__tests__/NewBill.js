/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor, getByTestId} from "@testing-library/dom" // Ajout fireEvent (déclenchement action sur DOM) & waitFor (Async)

import userEvent from '@testing-library/user-event'

import { ROUTES, ROUTES_PATH } from "../constants/routes"
import router from "../app/Router" // ok
import { localStorageMock } from "../__mocks__/localStorage.js"

import { bills } from "../fixtures/bills"
import { billsUI } from "../views/BillsUI.js"
import { NewBillUI } from "../views/NewBillUI.js"
import { NewBill } from "../containers/NewBill.js"

import mockStore from "../__mocks__/store"
import Store from "../app/Store.js"

// Récupération des données du store avec la fonction mock() de Jest
// jest.mock('../app/store')
jest.mock("../app/store", () => mockStore)

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
// Initialisation du onNavigate
const onNavigate = (pathname) => { screen.innerHTML = path }

// localStorage - modification de l'objet window avec la méthode defineProperties
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})
// utilisation de l'accesseur setitem de la fonction localStorageMock
window.localStorage.setItem('user',  JSON.stringify({ type: 'Employee'}))

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then icon the vertical Layout must be highlighted", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //Routage variable
      const pathName = ROUTES_PATH['NewBill']

      // Mocked teh data
      store.bills = () => ({
        bills,
        get: jest.fn().mockResolvedValue()
      })

      // Construction DOM
      Object.defineProperty(window, 'location', {
        value: {
            hash: pathname
        }
      });

      screen.innerHTML = `<div id='root'></div>`;

      Router();

      // Check screen has id icon-mail
      expect(screen.getByTestId('icon-mail')).toBeTruthy();

      // Check icon-mail contains the class "active-icon"
      expect(screen.getByTestId('icon-mail').classList.contains('active-icon')).toBeTruthy();
    })
  })

  describe("When I want to upload a proof", () => {
    test("Then the file must have the good extension", () => {
      // AFFICHAGE USER INTERFACE - NOUVELLE FACTURE - NewBillUI()
      const html = NewBillUI()
      screen.innerHTML = html

      // Création d'une nouvelle facture
      const newBill = new newBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })

      // Utilisation mock function pour fonction handleFileChange()
      const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

      // Ajout Evenement et query Fire
      const inputFile = screen.getByTestId('file');
      inputFile.addEventListener('change', handleChangeFile);

      // Déclenchement de l'événement
      fireEvent.change(inputFile, {
        target: {
          files: [new file(['image.png'], 'image.png', { type: 'image/png'})]
        }
      })

      // function handleChangeFile have to be called
      expect(handleChangeFile).toBeCalled()
      // File name should be 'image.png'
      expect(inputFile.files[0].name).toBe('image.png')
      // Check if the text screen message is 'Envoyer une note de frais'
      expect(screen.getByTest('ENvoyer une note de frais').toBeTruthy())
      // Check error message in the Dom
      expect(html.includes("<div class=\"hideErrorMessage\" id=\"errorFileType\" data-testid=\"errorFile\">")).toBeTruthy();

    })
  })
})
