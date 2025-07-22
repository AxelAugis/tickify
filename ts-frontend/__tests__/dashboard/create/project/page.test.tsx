const mockUser: { id: number; name: string } | null = { id: 1, name: 'Test User' };
const mockLoading = false;

jest.mock('@/store/useUserStore', () => ({
  __esModule: true,
  default: () => ({
    user: mockUser,
    loading: mockLoading,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

import CreateProjectPage from "@/app/dashboard/create/project/page";
import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import axios from "@/utils/axios";

describe("CreateProjectPage", () => {
  it("Render create project page", () => {
    render(<CreateProjectPage />);
    expect(screen.getByText("Créer un projet")).toBeInTheDocument();
  });

  it("Submit form with valid data", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ status: 201, data: { uuid: 'fake-uuid' } });
    render(<CreateProjectPage />);

    fireEvent.change(screen.getByPlaceholderText("Entrez le nom de votre projet"), { target: { value: "Mon projet" } });
    fireEvent.change(screen.getByPlaceholderText("Entrez une description pour votre projet"), { target: { value: "Description" } });

    fireEvent.submit(screen.getByTestId('create-project-form'));

    const submittedBody = (axios.post as jest.Mock).mock.calls[0][1];

    expect(submittedBody).toMatchObject({
      name: "Mon projet",
      description: "Description",
      firstColor: expect.any(String),
      secondColor: expect.any(String),
      teams: expect.any(Array),
      branch: {
        name: expect.any(String),
        description: expect.any(String)
      }
    });
  });
});