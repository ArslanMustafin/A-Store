import { createMemoryRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { fireEvent, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';

import { store } from 'store';
import { cartActions } from 'store/cart';

import { renderWithProviders } from 'utils/tests-utils';

import { ROUTES } from 'routes/constants';

import { customProductMock, productMock } from 'mocks/data/product';
import { getCustomProductMockHandler, getProductMockHandler } from 'mocks/handlers/product';

import { ProductPage } from './product';

describe('Render tests', () => {
  it('should render correctly', () => {
    renderWithProviders(<ProductPage />);

    expect(screen.getByTestId('product-page')).toBeInTheDocument();
  });
});

describe('With server tests', () => {
  const routerConfig: RouteObject[] = [
    {
      path: ROUTES.product,
      element: <ProductPage />,
    },
  ];

  const server = setupServer(getProductMockHandler, getCustomProductMockHandler);

  beforeAll(() => server.listen());

  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  describe('Should get product correctly', () => {
    it('should render product', async () => {
      const router = createMemoryRouter(routerConfig, {
        initialEntries: ['/products/3'],
      });

      renderWithProviders(<RouterProvider router={router} />, { store });

      const title = await screen.findByRole('heading', {
        level: 2,
      });

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(productMock.title);
    });

    it('should render custom product', async () => {
      const router = createMemoryRouter(routerConfig, {
        initialEntries: ['/products/5'],
      });

      renderWithProviders(<RouterProvider router={router} />, { store });

      const title = await screen.findByRole('heading', {
        level: 2,
      });

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(customProductMock.title);
    });
  });

  describe('Functions tests', () => {
    const DOWN_ARROW_KEY = { keyCode: 40 };
    const ENTER_KEY = { keyCode: 13 };

    const router = createMemoryRouter(routerConfig, {
      initialEntries: ['/products/5'],
    });

    it('should onChange select, if the same element is selected', async () => {
      renderWithProviders(<RouterProvider router={router} />, { store });

      expect(await screen.findByText(customProductMock.sizes[0])).toBeInTheDocument();

      const select = await screen.findByTestId('product-select-size');

      expect(select).toBeInTheDocument();

      fireEvent.click(select);
      fireEvent.keyDown(select, DOWN_ARROW_KEY);
      fireEvent.keyDown(select, DOWN_ARROW_KEY);
      fireEvent.keyDown(select, ENTER_KEY);

      expect(screen.getByText(customProductMock.sizes[1])).toBeInTheDocument();
    });

    it('should onChange select, if the selected item is selected', async () => {
      renderWithProviders(<RouterProvider router={router} />, { store });

      expect(await screen.findByText(customProductMock.sizes[0])).toBeInTheDocument();

      const select = await screen.findByTestId('product-select-size');

      fireEvent.click(select);
      fireEvent.keyDown(select, DOWN_ARROW_KEY);
      fireEvent.keyDown(select, ENTER_KEY);

      expect(screen.getByText(customProductMock.sizes[0])).toBeInTheDocument();
    });

    it('should show select models', async () => {
      const routerWithModel = createMemoryRouter(routerConfig, {
        initialEntries: ['/products/3'],
      });

      renderWithProviders(<RouterProvider router={routerWithModel} />, {
        store,
      });

      expect(await screen.findByTestId('product-select-model')).toBeInTheDocument();
    });

    const mockDispatch = jest.fn();

    jest.mock('store/index.ts', () => ({
      useAppDispatch: mockDispatch,
    }));

    it('should call dispatch on submit click', async () => {
      renderWithProviders(<ProductPage />, {
        preloadedState: { product: { isLoading: false, hasError: false, product: productMock } },
      });
      const form = await screen.findByRole('form');
      fireEvent.submit(form);

      setTimeout(() => {
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(cartActions.add);
      }, 0);
    });
  });
});
