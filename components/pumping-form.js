import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { dayjs, roundDownToQuarterHour } from '../core/dayjs';
import { AMOUNTS } from '../core/constants';

export const PumpingForm = ({ initial, onSubmit }) => {
  const format = 'YYYY-MM-DDTHH:mm';

  const [date, setDate] = useState(
    initial ? initial.date : roundDownToQuarterHour(),
  );

  const [amount, setAmount] = useState(
    initial ? initial.session_amount_oz : null,
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
      <Form.Item label="Session amount (oz.)">
        <select
          style={{ width: '100%' }}
          value={amount}
          onChange={e => setAmount(e.target.value)}
        >
          <option disabled> </option>
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
          disabled={date === null || amount === null}
          onClick={() =>
            onSubmit({
              date: dayjs(date)
                .toDate()
                .getTime(),
              session_amount_oz: amount,
            })
          }
        >
          Confirm
        </Button>
      </Form.Item>
    </Form>
  );
};
