/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore)

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
      console.log(windowIcon)
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true) 

    })
    test("Then the bills should be ordered from earliest to latest", () => {
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

          const html = BillsUI({ data: bills })
          document.body.innerHTML = html

          const onNavigate = pathname => { document.body.innerHTML = ROUTES({ pathname }); };
          Object.defineProperty(window, "localStorage", { value: localStorageMock });

          const allBills = new Bills({
            document,
            onNavigate,
            store: null,
            localStorage: window.localStorage
          })

          // Mocking the function handleClickNewBill()
          const handleClickNewBill = jest.fn(() => allBills.handleClickNewBill)
          console.log('handleClickNewBill')
          // Targeting the btn icon
          const billBtn = screen.getByTestId('btn-new-bill') // ICI BUGGY
          console.log(billBtn)
          console.log(typeof billBtn)
          // Managing of Event and Query Fire
          billBtn.addEventListener('click', handleClickNewBill())
          userEvent.click(billBtn)
          // The screen should show 'Envoyer une note de frais'
          expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
        })
    })
  })
// })

  // TESTING THE ICON EYE for DISPLAYING MODAL WITH IMAGE - handleClickIconEye 
  describe('When I click on the eye icon of one bill', () => {
    test('Then a modal should open', async () => {
      const onNavigate = pathname => { document.body.innerHTML = ROUTES({ pathname }); };
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      document.body.innerHTML = BillsUI({ data: bills })
      const containerBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })

      // Modal comportement avec fn.modal
      const modaleFile = document.getElementById('modaleFile')
      $.fn.modal = jest.fn(() => modaleFile.classList.add('show'))

      // Targeting the eyes icons
      const eyeIcon = await screen.getAllByTestId('icon-eye')

      // Mocking the function handleClickIconEye()
      const handleClickIconEye = jest.fn((icon)=> containerBills.handleClickIconEye(icon))

      // Managing of Event 
      eyeIcon.forEach(icon => {
        icon.addEventListener('click', handleClickIconEye(icon))
        userEvent.click(icon)
      // The function handleClickIconEye have to be called
      expect(handleClickIconEye).toHaveBeenCalled()
      })

      expect(modaleFile).toBeTruthy()
    })
  })
// })

// TEST D'INTEGRATION GET
describe('Given I am connected as employee', () => {
  describe('When I am on the Bills page', () => {
    test('Then we fetch the bills from mock API GET', async () => {
      localStorage.setItem('user', JSON.stringify({ type: 'Employee, e@e'}))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.appendChild(root)

      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getAllByText('Mes notes de frais'))

      expect(screen.getByTestId('tbody')).toBeTruthy()
    })
  })

  describe('When an error occurs in API', () => {
    beforeEach(() => {
      jest.spyOn(mockStore, 'bills')
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify( {type: 'Employee', email: 'e@e'}))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.appendChild(root)
      router()
    })

    test('Then we fetch the bills from the API and this fails 404 error message', async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return { list: () => { return Promise.reject(new Error('Erreur 404')); }}
      })
    // })

    window.onNavigate(ROUTES_PATH.Bills)
    await new Promise(process.nextTick)
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })

  test('Then we fetch the message from API an we have in return a 500 message error', async ()=> {
      mockStore.bills.mockImplementationOnce(() => {
        return { list: () => { return Promise.reject(new Error('Erreur 500')); }}
      })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
  })
})