/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent, getByTestId, queries} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true) 

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
    // TEST FOR CHECKING IF THE PAGE IS LOADING WHEN I AM ON THE BILL PAGE
  describe("When the page is loading", () => {
    test("Then I should land on the bill page", () => {
      document.body.innerHTML = BillsUI({ 
        data: [],
        loading: true
      })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })

  // TEST FOR THE MESSAGE ERROR WHEN WE ARE LOADING THE PAGE AND THE SERVER GIVE US BACK AN ERROR MESSAGE
  describe("When I am on the bill page but the server send us back an error", () => {
    test("Then the page should display and error message on the page", () => {
      document.body.innerHTML = BillsUI({
        data: [],
        loading: false,
        error: "Erreur"
      })

      // The screen have to display the Erreur message
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
})
  // TESTING handleClickNewBill() HE BUTTON FOR NEW BILL
  describe('Given I am connected as an employee and on the bills page', () => {
    describe('When I click on the new button bill', () => {
        test('Then the  should display a new Bill page', () => {
          const html = BillsUI({
            data: []
          })

          document.body.innerHTML = html

          const store = null

          const allBills = new Bills({
            document,
            onNavigate,
            store,
            localStorage: window.localStorage
          })

          // Mocking the function handleClickNewBill()
          const handleClickNewBill = jest.fn(allBills.handleClickNewBill)
          console.log('handleClickNewBill')
          // Targeting the btn icon
          const billBtn = $(`button[data-testid="btn-new-bill"]`)
          console.log(billBtn)
          console.log(typeof billBtn)
          // Managing of Event and Query Fire
          billBtn.addEventListener('click', handleClickNewBill)
          fireEvent.click(billBtn)
          // The screen should show 'Envoyer une note de frais'
          expect(screen.getAllByText('Nouvelle note de frais')).toBeTruthy()
        })
    })
  })
// })

  // TESTING THE ICON EYE for DISPLAYING MODAL WITH IMAGE - handleClickIconEye 
  describe('When I click on the eye icon', () => {
    test('Then a modal should open', () => {
      const html = BillsUI({
        data: bills
      })

      document.body.innerHTML = html

      const store = null
      const  allBills = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage
      })

      // Modal comportement avec fn.modal
      $.fn.modal = jest.fn()

      // Trageting the eyes icons
      const eyeIcon = screen.getByAllTestId('icon-eye')

      // Mocking the function handleClickIconEye()
      const handleClickIconEye = jest.fn(()=> allBills.handleClickIconEye(eyeIcon))

      // Managing of Event and Query Fire
      eyeIcon.addEventListener('click', handleClickIconEye)
      fireEvent.click(eyeIcon)

      // The function handleClickIconEye have to be called
      expect(handleClickIconEye).toHaveBeenCalled()
      //Modal shoul be displayed
      const modale = document.getElementById('modaleFile')
      console.log(modale)
      expect(modale).toBeTruthy()
    })
  })
// })

// TEST D'INTEGRATION 
// describe('Given I am connected as employee', () => {
//   describe('When I go to BillsUI', () => {
//     test('We fetch the bills from mock API GET', async () => {
//       const billSpy = jest.spyOn(store, 'list')
//       const bills  = await.store.list()

//       expect(billSpy).toHaveBeenCalledTimes(1)
//       // Number of bills must be four
//       expect(bills.data.length).toBe(4)
//     })

//   })
// })