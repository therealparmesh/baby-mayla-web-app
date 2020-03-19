import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import { Typography } from 'antd';
import { dayjs } from '../core/dayjs';

const PumpingsTimeline = ({ children }) => {
  return <VerticalTimeline>{children}</VerticalTimeline>;
};

PumpingsTimeline.Element = ({ date, amount, onClick }) => {
  return (
    <VerticalTimelineElement>
      <button
        style={{
          height: '100%',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
        }}
        onClick={onClick}
      >
        <Typography.Title>{dayjs(date).format('LT')}</Typography.Title>
        <Typography.Text>
          <Typography.Text strong>{amount}</Typography.Text> bottle oz.
        </Typography.Text>
      </button>
    </VerticalTimelineElement>
  );
};

export { PumpingsTimeline };
