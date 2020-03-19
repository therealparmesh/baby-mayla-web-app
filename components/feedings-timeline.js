import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import { Typography } from 'antd';
import { dayjs } from '../core/dayjs';
import { FEEDING_TYPES } from '../core/constants';

const FeedingsTimeline = ({ children }) => {
  return <VerticalTimeline>{children}</VerticalTimeline>;
};

FeedingsTimeline.Element = ({ date, type, amount, onClick }) => {
  const typeToTextMap = {
    [FEEDING_TYPES.BREAST]: 'Breastfed',
    [FEEDING_TYPES.BOTTLE]: 'Bottle-fed',
    [FEEDING_TYPES.BOTTLE_INCLUDING_FORMULA]: 'Bottle-fed (including formula)',
    [FEEDING_TYPES.MIXED]: 'Fed with both breast and bottle',
    [FEEDING_TYPES.MIXED_INCLUDING_FORMULA]:
      'Fed with both breast and bottle (including formula)',
  };

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
        <Typography.Text>{typeToTextMap[type]}</Typography.Text>
        {type !== FEEDING_TYPES.BREAST && (
          <>
            <br />
            <Typography.Text>
              <Typography.Text strong>{amount}</Typography.Text> bottle oz.
            </Typography.Text>
          </>
        )}
      </button>
    </VerticalTimelineElement>
  );
};

export { FeedingsTimeline };
