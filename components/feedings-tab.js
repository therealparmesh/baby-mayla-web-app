import { useState, useEffect } from 'react';
import { Alert, Button, Input } from 'antd';
import { Modal } from './modal';
import { FeedingsTimeline } from './feedings-timeline';
import { FeedingForm } from './feeding-form';
import { dayjs } from '../core/dayjs';
import { firebase } from '../core/firebase';
import { DATABASES } from '../core/constants';

let initial;

export const FeedingsTab = () => {
  const [filterDate, setFilterDate] = useState(dayjs());
  const [feedings, setFeedings] = useState(initial);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(DATABASES.FEEDINGS)
      .onSnapshot(({ docs }) => {
        initial = docs.map(doc => ({ ...doc.data(), id: doc.id }));

        setFeedings(initial);
      });

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
            onClick={() => setIsCreateModalOpen(true)}
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
                  key={feeding.id}
                  date={feeding.date}
                  type={feeding.type}
                  amount={feeding.bottle_amount_oz}
                  onClick={() => setIsEditModalOpen(feeding)}
                />
              ))}
            </FeedingsTimeline>
          )}
        </div>
        <Modal
          title="There's been a feeding!"
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
        >
          <FeedingForm
            onSubmit={data => {
              firebase
                .firestore()
                .collection(DATABASES.FEEDINGS)
                .add(data);

              setIsCreateModalOpen(false);
            }}
          />
        </Modal>
        <Modal
          title="There was a feeding!"
          isOpen={Boolean(isEditModalOpen)}
          onClose={() => {
            setIsEditModalOpen(null);
          }}
        >
          <FeedingForm
            initial={isEditModalOpen}
            onSubmit={data => {
              firebase
                .firestore()
                .collection(DATABASES.FEEDINGS)
                .doc(isEditModalOpen.id)
                .set(data);

              setIsEditModalOpen(null);
            }}
          />
        </Modal>
      </>
    )
  );
};
