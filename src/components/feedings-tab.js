import { useState, useEffect } from 'preact/hooks';
import { Alert, Button, Input } from 'antd';
import { Modal } from './modal';
import { FeedingsTimeline } from './feedings-timeline';
import { FeedingForm } from './feeding-form';
import { dayjs } from '../core/dayjs';
import { firebase } from '../core/firebase';
import { DATABASES } from '../core/constants';

export const FeedingsTab = () => {
  const [filterDate, setFilterDate] = useState(dayjs());
  const [feedings, setFeedings] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(DATABASES.FEEDINGS)
      .onSnapshot(({ docs }) =>
        setFeedings(docs.map(doc => ({ ...doc.data(), id: doc.id }))),
      );

    return unsubscribe;
  }, []);

  const sortedFeedings = [...(feedings || [])].sort((a, b) => b.date - a.date);

  const filteredFeedings = sortedFeedings.filter(
    feeding =>
      feeding.date >=
        filterDate
          .startOf('day')
          .toDate()
          .getTime() &&
      feeding.date <=
        filterDate
          .endOf('day')
          .toDate()
          .getTime(),
  );

  const format = 'YYYY-MM-DD';

  return (
    Boolean(sortedFeedings.length) && (
      <>
        {sortedFeedings[0] && (
          <Alert
            style={{ marginBottom: '32px' }}
            type="info"
            showIcon
            message="Last feeding"
            description={dayjs(sortedFeedings[0].date).fromNow()}
          />
        )}
        <div style={{ textAlign: 'center' }}>
          <Button
            style={{ marginBottom: '32px' }}
            type="primary"
            block
            onClick={() => setIsModalOpen(true)}
          >
            Add feeding
          </Button>
          <Input
            style={{ marginBottom: '8px' }}
            type="date"
            value={dayjs(filterDate).format(format)}
            onChange={e => setFilterDate(dayjs(e.target.value, format))}
          />
          {filteredFeedings[0] && (
            <FeedingsTimeline>
              {filteredFeedings.map(feeding => (
                <FeedingsTimeline.Element
                  date={feeding.date}
                  type={feeding.type}
                  amount={feeding.bottle_amount_oz}
                />
              ))}
            </FeedingsTimeline>
          )}
        </div>
        <Modal
          title="There's been a feeding!"
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <FeedingForm
            onSubmit={data => {
              firebase
                .firestore()
                .collection(DATABASES.FEEDINGS)
                .add(data);

              setIsModalOpen(false);
            }}
          />
        </Modal>
      </>
    )
  );
};
