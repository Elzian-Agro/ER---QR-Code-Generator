import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalComponent from '../components/ModalComponent';

describe('ModalComponent', () => {
    test('renders modal with header and content and close modal', () => {
    // Define props
    const showModal = true;
    const closeModal = jest.fn();
    const modalHeader = 'Test Modal Header';
    const modalContent = <p>Test Modal Content</p>;
    
    // Render ModalComponent with props
    render(
        <ModalComponent
            showModal={showModal}
            closeModal={closeModal}
            modalHeader={modalHeader}
            modalContent={modalContent}
        />
    );

    // Check if modal is rendered
    expect(screen.getByText(modalHeader)).toBeInTheDocument();

    // Check if modal content is rendered
    expect(screen.getByText('Test Modal Content')).toBeInTheDocument();
    
    // Check if closeModal function was called
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(closeModal).toHaveBeenCalled();
  });
});
