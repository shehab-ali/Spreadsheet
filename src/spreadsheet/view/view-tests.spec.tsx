import React from 'react';
import { render, act } from '@testing-library/react';
import { FileSystemView } from './FileSystemView';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Mocking the useSelector and useNavigate hooks
jest.mock('react-redux');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('User Authentication', () => {
  beforeEach(() => {
    useSelector.mockReturnValue({ userId: undefined }); // Mock userId as undefined initially
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  it('should redirect to Login when userId is undefined', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(<FileSystemView />);

    expect(useSelector).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/Login');
  });

  it('should redirect to Login when userId is null', () => {
    useSelector.mockReturnValue({ userId: null }); // Mock userId as null
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(<FileSystemView />);

    expect(useSelector).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/Login');
  });

  it('should fetch spreadsheets when userId is valid', async () => {
    useSelector.mockReturnValue({ userId: 'validUserId' }); // Mock valid userId
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    // Mock API call or dependency functions (like pb.collection) for fetching spreadsheets
    // Use mockResolvedValueOnce or mockImplementationOnce to simulate API call success

    await act(async () => {
      render(<FileSystemView />);
    });

    expect(useSelector).toHaveBeenCalled();
    // Add assertions to check the successful fetch of spreadsheets
    // Expect appropriate elements or text in the component based on successful fetching
  });

  // Additional test cases for error scenarios during fetching spreadsheets can be added here
});
