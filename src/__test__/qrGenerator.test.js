import { render, screen, act, cleanup } from "@testing-library/react";
import QRCodeGenerator from "../components/QRCodeGenerator";

// Mock the QRCodeStyling library
jest.mock("qr-code-styling");

describe("QRCodeGenerator Component", () => {
  // Setup
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  const qrCodeContent = "TestQRCodeContent";

  test("renders without crashing", () => {
    render(<QRCodeGenerator qrCodeContent={qrCodeContent} />);
  });

  test("cleans up previous content when updated with new QR code content", async () => {
    // Arrange
    const { container, rerender } = render(<QRCodeGenerator qrCodeContent={qrCodeContent} />);

    // Act
    await act(async () => {
      const newQRCodeContent = "NewTestQRCodeContent";
      rerender(<QRCodeGenerator qrCodeContent={newQRCodeContent} />);
    });

    // Assert
    const previousQRCodeContainer = container.querySelector("div[data-testid='mock-qr-code-generator']");
    expect(previousQRCodeContainer).not.toBeInTheDocument();
  });

  test("cleans up when unmounted", async () => {
    // Arrange
    let container;

    // Act
    await act(async () => {
      const { container: renderedContainer, unmount } = render(<QRCodeGenerator qrCodeContent={qrCodeContent} />);
      container = renderedContainer;
      unmount();
    });

    // Assert
    const qrCodeContainer = container.querySelector("div[data-testid='mock-qr-code-generator']");
    expect(qrCodeContainer).not.toBeInTheDocument();
  });
});
