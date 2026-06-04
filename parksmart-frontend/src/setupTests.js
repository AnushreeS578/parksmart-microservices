import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

//  FIX jsPDF ERROR
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// MOCK ROUTER
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: {
      id: 1,
      location: "Test Parking"
    }
  }),
  BrowserRouter: ({ children }) => children,
}));

//  MOCK jsPDF (VERY IMPORTANT)
jest.mock("jspdf", () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    save: jest.fn(),
    setFontSize: jest.fn(),
  })),
}));