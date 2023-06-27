/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom" // Ajout fireEvent (déclenchement action sur DOM) & waitFor (Async)

import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import mockStore from "../__mocks__/store"
import router from "../app/Router.js" 

// Récupération des données du store avec la fonction mock() de Jest
jest.mock("../app/Store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then icon of mail in the vertical Layout must be highlighted", async () => {
      // localStorage - modification de l'objet window avec la méthode defineProperty
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })

      // utilisation de l'accesseur setitem de la fonction localStorageMock
      window.localStorage.setItem('user',  JSON.stringify({ type: 'Employee'}))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.append(root)

      router();

      // Initialisation du onNavigate
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))

      // Check screen has id icon-mail and contains .active icon
      const emailIcon = screen.getByTestId('icon-mail')
      expect(emailIcon).toBeTruthy();
      expect(screen.getByTestId('icon-mail').classList.contains('active-icon')).toBeTruthy();
    })

    test("Then the inputs forms should be displayed on the web page", () => {
      document.body.innerHTML = NewBillUI()
      const expenseField = screen.getByTestId('expense-type')
      expect(expenseField).toBeDefined()
      expect(expenseField).toBeTruthy()

      const nameExpenseField = screen.getByTestId('expense-name')
      expect(nameExpenseField).toBeDefined()
      expect(nameExpenseField).toBeTruthy()

      const dateField = screen.getByTestId('datepicker')
      expect(dateField).toBeDefined()
      expect(dateField).toBeTruthy()
    })
  })

  // TEST D'INTEGRATION POST
  describe("When I am on the newBill page, I fill the form and submit", () => {
    test("Then the new bill should be added to the API POST", async() => {
      // AFFICHAGE USER INTERFACE - NOUVELLE FACTURE - NewBillUI()
      const html = NewBillUI()
      document.body.innerHTML = html

      // Initialisation d'une nouvelle facture factice - Document
        const bill = {
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

      

      // Ciblage de chaque champs d'entrée du formulaire & simulation du changement avec fireEvent
      const expenseField = screen.getByTestId('expense-type')
      console.log(expenseField)
      fireEvent.change(expenseField, {target: {value: bill.type} })
      expect(expenseField.value).toBe(bill.type)

      const nameExpenseField = screen.getByTestId('expense-name')
      fireEvent.change(nameExpenseField, {target: {value: bill.name} })
      expect(nameExpenseField.value).toBe(bill.name)

      const dateField = screen.getByTestId('datepicker')
      fireEvent.change(dateField, {target: {value: bill.date} })
      expect(dateField.value).toBe(bill.date)

      const amountField = screen.getByTestId('amount')
      fireEvent.change(amountField, {target: {value: bill.amount} })
      expect(parseInt(amountField.value)).toBe(parseInt(bill.amount))

      const vatField = screen.getByTestId('vat')
      fireEvent.change(vatField, {target: {value: bill.vat} })
      expect(parseInt(vatField.value)).toBe(parseInt(bill.vat))

      const pctField = screen.getByTestId('pct')
      fireEvent.change(pctField, {target: {value: bill.pct} })
      expect(parseInt(pctField.value)).toBe(parseInt(bill.pct))

      const commentaryField = screen.getByTestId('commentary')
      fireEvent.change(commentaryField, {target: {value: bill.commentary} })
      expect(commentaryField.value).toBe(bill.commentary)

      const onNavigate = pathname => { document.body.innerHTML =  ROUTES({ pathname})}
      const newBillForm = screen.getByTestId('form-new-bill')
      Object.defineProperty(window, 'localStorage', { value: localStorageMock})
      
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      newBillForm.addEventListener('change', handleChangeFile)

      const fileField = screen.getByTestId('file')
      fireEvent.change(fileField, {target: {files: [new File([bill.fileName], bill.fileUrl, {type: 'image/png'}) ] }})
      expect(fileField.files[0].name).toBe(bill.fileUrl)
      expect(fileField.files[0].type).toBe('image/png')
      expect(handleChangeFile).toHaveBeenCalled()

      const handleSubmit = jest.fn(newBill.handleSubmit);
      newBillForm.addEventListener("submit", handleSubmit);
      fireEvent.submit(newBillForm);
      expect(handleSubmit).toHaveBeenCalled();
    })

    

  })
})
