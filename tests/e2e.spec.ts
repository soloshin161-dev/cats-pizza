//Авторизация
//Регистрация
//Оформление заказа для неавторизованного пользователя
//Оформление заказа для авторизованного пользователя

import { test, expect } from '@playwright/test';
import { request } from 'http';

const TEST_USER_EMAIL = 'test1@test.ru';
const TEST_USER_PASSWORD = 'qwerty';
const API_URL = 'http://localhost:3001';

test.describe('Auth', () => {

  let createdUserEmail: string | null = null;

  test.afterAll(async ({ request }) => {
    if (!createdUserEmail) return;

    await request.delete(`${API_URL}/users/by-email`, {
      data: { email: createdUserEmail },
    });

    createdUserEmail = null;
  })

  test('Sign in', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByTestId('signInButton').click();
    await page.getByLabel('Email').fill(TEST_USER_EMAIL);
    await page.getByLabel('Пароль').fill(TEST_USER_PASSWORD);
    await page.getByTestId('signInOrSignUpButton').click();

    expect(page.getByTestId('signOutButton')).toBeVisible();
  });

  test('Sign up', async ({ page }) => {

    createdUserEmail = `${Date.now()}@test.ru`;

    await page.goto('http://localhost:5173/');
    await page.getByTestId('signInButton').click();
    await page.getByTestId('registerButton').click();
    await page.getByLabel('Имя').fill('Тест');
    await page.getByLabel('Email').fill(createdUserEmail);
    await page.getByLabel('Пароль:', { exact: true }).fill(TEST_USER_PASSWORD);
    await page.getByLabel('Повторите пароль:', { exact: true }).fill(TEST_USER_PASSWORD);
    await page.getByTestId('signInOrSignUpButton').click();

    expect(page.getByTestId('signOutButton')).toBeVisible();
  });
})

test.describe('Orders', () => {

  test.describe.configure({ mode: 'serial' });

  test.afterEach(async ({ request }) => {
    await request.delete(`${API_URL}/orders/by-email`, {
      data: { email: TEST_USER_EMAIL },
    });
  });

  test('Make order with login', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByTestId('catCard_0').getByTestId('addToCartButton').click();
    await page.getByTestId('catModalAddToCartButton').click();
    await page.getByTestId('openCartButton').click();
    await page.getByTestId('goToCartPageButton').click();
    await page.getByTestId('makeOrderButton').click();
    await page.getByLabel('Email').fill(TEST_USER_EMAIL);
    await page.getByLabel('Пароль').fill(TEST_USER_PASSWORD);
    await page.getByTestId('signInOrSignUpButton').click();
    await page.getByLabel('Город').fill('Москва');
    await page.getByLabel('Улица').fill('Садовая');
    await page.getByLabel('Дом').fill('4');
    await page.getByLabel('Квартира').click();
    await page.getByLabel('Комментарий курьеру').fill('Позвонить');
    await page.getByTestId('approveOrder').click();
    await expect(page.getByTestId('modalTitle')).toHaveText('Заказ оформлен');
    await page.getByTestId('closeSubmittedModalButton').click();
    await page.getByTestId('openOrdersButton').click();
    await expect(page.getByTestId('ordersList').getByRole('listitem').first()).toBeVisible();
  });

  test('Make order', async ({ page }) => {

    await page.goto('http://localhost:5173/');
    await page.getByTestId('signInButton').click();
    await page.getByTestId('registerButton').click();
    await page.getByLabel('Имя').fill('Тест');
    await page.getByLabel('Email').fill(`${Date.now()}@test.ru`);
    await page.getByLabel('Пароль:', { exact: true }).fill(TEST_USER_PASSWORD);
    await page.getByLabel('Повторите пароль:', { exact: true }).fill(TEST_USER_PASSWORD);
    await page.getByTestId('signInOrSignUpButton').click();
    await page.getByTestId('catCard_0').getByTestId('addToCartButton').click();
    await page.getByTestId('catModalAddToCartButton').click();
    await page.getByTestId('openCartButton').click();
    await page.getByTestId('goToCartPageButton').click();
    await page.getByTestId('makeOrderButton').click();
    await page.getByLabel('Город').fill('Москва');
    await page.getByLabel('Улица').fill('Садовая');
    await page.getByLabel('Дом').fill('4');
    await page.getByLabel('Квартира').click();
    await page.getByLabel('Комментарий курьеру').fill('Позвонить');
    await page.getByTestId('approveOrder').click();
    await expect(page.getByTestId('modalTitle')).toHaveText('Заказ оформлен');
    await page.getByTestId('closeSubmittedModalButton').click();
    await page.getByTestId('openOrdersButton').click();
    await expect(page.getByTestId('ordersList').getByRole('listitem').first()).toBeVisible();
  });
})




