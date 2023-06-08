/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

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
  describe("When the server send us back an error", () => {
    test("Then the page should display and error message on the page", () => {
      document.body.innerHTML = BillsUI({
        data: [],
        loading: false,
        error: "erreur"
      })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

  //TESTING THE BUTTON FOR NEW BILL
  // describe('When I am on Bills Page', () => {
  //   test('The click on the new button bill should display', () => {
  //     document.body.innerHTML = NewBill({

  //     })
  //     expect(screen.getByRole()).toBeTruthy()
  //   })

  //   // TESTING THE ICON EYE for DISPLAYING MODAL WITH IMAGE

  // })
})
