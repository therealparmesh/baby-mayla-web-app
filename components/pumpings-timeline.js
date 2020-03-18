import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import { Typography } from 'antd';
import { dayjs } from '../core/dayjs';

const PumpingsTimeline = ({ children }) => {
  return <VerticalTimeline>{children}</VerticalTimeline>;
};

PumpingsTimeline.Element = ({ date, amount }) => {
  return (
    <VerticalTimelineElement>
      <Typography.Title>{dayjs(date).format('LT')}</Typography.Title>
      <Typography.Text>
        <Typography.Text strong>{amount}</Typography.Text> bottle oz.
      </Typography.Text>
    </VerticalTimelineElement>
  );
};

export { PumpingsTimeline };
