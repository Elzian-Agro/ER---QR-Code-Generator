import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'; 
import QrGenerator from '../pages/qrGeneratorPage';
import { act } from 'react-dom/test-utils';

// Mock the Axios module
jest.mock('axios', () => ({
  get: jest.fn(),
}));

// Mock the react-router-dom module
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

// Mock the AuthContext
jest.mock('../AuthContext', () => ({
  useAuth: () => ({
     authenticated: true
  }),
}));

describe('QrGenerator Component', () => {
  test('renders without crashing', () => {
    const { getByTestId } = render(
      <Router>        
          <QrGenerator />       
      </Router>
    );
      
    // Check rendered elements or content
    expect(screen.getByText('Generate QR CODE')).toBeInTheDocument();
    expect(getByTestId('btn-loguot')).toBeInTheDocument();
    expect(getByTestId('btn-sample-sheet-download')).toBeInTheDocument();
    expect(screen.getByText('Excel URL :')).toBeInTheDocument();
    expect(getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByText('Upload file XLS :')).toBeInTheDocument();
    expect(getByTestId('url-input')).toBeInTheDocument();      
    expect(getByTestId('btn-view-data')).toBeInTheDocument();
    expect(getByTestId('btn-gen-qr')).toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    localStorage.setItem('rememberedUsername', 'testUser');
    localStorage.setItem('rememberedPassword', 'testPassword');

    let getByTestId;

    act(() => {
      const { getByTestId: getTestId } = render(
        <Router>
          <QrGenerator />
        </Router>
      );
      getByTestId = getTestId;
    });

    // Simulate clicking the logout button
    fireEvent.click(getByTestId('btn-loguot'));

    // Check if localStorage items are removed
    expect(localStorage.getItem('rememberedUsername')).toBeNull();
    expect(localStorage.getItem('rememberedPassword')).toBeNull();

    // Check if navigate is called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/ER---QR-Code-Generator');
  });

  test('handles file upload correctly', () => {
    const { getByTestId } = render(
      <Router>
        <QrGenerator />
      </Router>
    );

    act(() => {
      // Mock a file object
      const file_1 = new File(['sample content'], 'sample.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const file_2 = new File(['sample content'], 'sample.xlsx', { type: 'application/vnd.ms-excel' });

      // Simulate a file upload event
      fireEvent.change(getByTestId('file-input'), { target: { files: [file_1] } });
      fireEvent.change(getByTestId('file-input'), { target: { files: [file_2] } });
    });
  });

  test('view Excel data model properly work', async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <QrGenerator />
      </Router>
    );

    // Simulate clicking the qr-generator button
    fireEvent.click(getByTestId('btn-view-data'));

    // check whether exel data view model is open
    expect(getByText('View Excel Data')).toBeInTheDocument(); 
  });

  test('view qr codes', async () => {
    const { getByTestId, getByText } = render(
      <Router>
        <QrGenerator />
      </Router>);

    // Simulate clicking the qr-generator button
    fireEvent.click(getByTestId('btn-gen-qr'));
    
    // Check whether qr element is view
    //expect(getByText('Your QR Codes')).toBeInTheDocument(); 
  });
});
