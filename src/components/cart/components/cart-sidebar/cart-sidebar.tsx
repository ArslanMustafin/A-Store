import React from 'react';

import { Amount } from '@alfalab/core-components/amount';
import { Button } from '@alfalab/core-components/button';
import { Divider } from '@alfalab/core-components/divider';
import { Gap } from '@alfalab/core-components/gap';
import { Typography } from '@alfalab/core-components/typography';

import { useAppSelector } from 'store';
import { cartSelector, cartTotalPriceSelector } from 'store/cart';

import styles from './cart-sidebar.module.css';

import { CartProduct } from '../../../cart-product';

type PropsType = {
  /**
   * Функция для открытия формы заказа
   */
  handleOpenOrderFormClick: () => void;
};

const CartSidebar = ({ handleOpenOrderFormClick }: PropsType) => {
  const products = useAppSelector(cartSelector);
  const totalPrice = useAppSelector(cartTotalPriceSelector);

  return (
    <div data-test-id='cart-sidebar' className={styles.sidebar}>
      <Divider />
      {!!products.length && (
        <ul className={styles.sidebarProducts}>
          {products.map((product) => {
            return (
              <li key={product.key} data-test-id='cart-sidebar-item'>
                <CartProduct product={product} />
              </li>
            );
          })}
        </ul>
      )}
      <Divider />
      <Gap size='m' />
      <Typography.Text view='primary-large' weight='bold' className={styles.totalPrice}>
        Сумма: <Amount value={totalPrice} currency='RUR' minority={1} bold='full' />
      </Typography.Text>
      <Gap size='4xl' />
      <Button
        view='primary'
        className={styles.sidebarNext}
        onClick={handleOpenOrderFormClick}
        block
      >
        <Typography.Text weight='bold' view='primary-large'>
          Дальше
        </Typography.Text>
      </Button>
    </div>
  );
};

export { CartSidebar };
