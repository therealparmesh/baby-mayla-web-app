import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { dayjs, roundDownToQuarterHour } from '../core/dayjs';
import { FEEDING_TYPES, AMOUNTS } from '../core/constants';

export const FeedingForm = ({ initial, onSubmit }) => {
  const format = 'YYYY-MM-DDTHH:mm';

  const [date, setDate] = useState(
    initial ? initial.date : roundDownToQuarterHour(),
  );

  const [type, setType] = useState(initial ? initial.type : FEEDING_TYPES.NONE);

  const [amount, setAmount] = useState(
    initial ? initial.bottle_amount_oz : AMOUNTS[0],
  );

  return (
    <Form layout="vertical">
      <Form.Item label="Date">
        <Input
          type="datetime-local"
          step={900}
          value={dayjs(date).format(format)}
          onChange={e => setDate(dayjs(e.target.value, format))}
          onBlur={() => setDate(d => roundDownToQuarterHour(d))}
        />
      </Form.Item>
      <Form.Item label="Type">
        <select
          style={{ width: '100%' }}
          value={type}
          onChange={e => {
            setType(e.target.value);

            if (e.target.value === FEEDING_TYPES.BREAST) {
              setAmount(0);
            }
          }}
        >
          <option value={FEEDING_TYPES.NONE}>----</option>
          <option value={FEEDING_TYPES.BREAST}>Breast</option>
          <option value={FEEDING_TYPES.BOTTLE}>Bottle</option>
          <option value={FEEDING_TYPES.BOTTLE_INCLUDING_FORMULA}>
            Bottle (including formula)
          </option>
          <option value={FEEDING_TYPES.MIXED}>Breast/bottle</option>
          <option value={FEEDING_TYPES.MIXED_INCLUDING_FORMULA}>
            Breast/bottle (including formula)
          </option>
        </select>
      </Form.Item>
      <Form.Item label="Bottle amount (oz.)">
        <select
          style={{ width: '100%' }}
          disabled={type === FEEDING_TYPES.BREAST}
          value={amount}
          onChange={e => setAmount(Number.parseFloat(e.target.value))}
        >
          {AMOUNTS.map(a => (
            <option key={a} value={a}>
              {a} oz.
            </option>
          ))}
        </select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          block
          disabled={
            type === FEEDING_TYPES.NONE ||
            (type !== FEEDING_TYPES.BREAST && amount === AMOUNTS[0])
          }
          onClick={() =>
            onSubmit({
              date: dayjs(date)
                .toDate()
                .getTime(),
              type,
              bottle_amount_oz: amount,
            })
          }
        >
          Confirm
        </Button>
      </Form.Item>
    </Form>
  );
};
