import { useState, useEffect } from 'react';
import { Alert, Button, Input, Typography } from 'antd';
import { Modal } from './modal';
import { PumpingsTimeline } from './pumpings-timeline';
import { PumpingForm } from './pumping-form';
import { dayjs } from '../core/dayjs';
import { firebase } from '../core/firebase';
import { DATABASES } from '../core/constants';

let initial;

export const PumpingsTab = () => {
  const [filterDate, setFilterDate] = useState(dayjs());
  const [pumpings, setPumpings] = useState(initial);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(DATABASES.PUMPINGS)
      .onSnapshot(({ docs }) => {
        initial = docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        setPumpings(initial);
      });

    return unsubscribe;
  }, []);

  const sortedPumpings = [...(pumpings || [])].sort((a, b) => b.date - a.date);

  const filteredPumpings = sortedPumpings.filter(
    (pumping) =>
      pumping.date >= filterDate.startOf('day').toDate().getTime() &&
      pumping.date <= filterDate.endOf('day').toDate().getTime(),
  );

  const format = 'YYYY-MM-DD';

  return (
    Boolean(sortedPumpings.length) && (
      <>
        {sortedPumpings[0] && (
          <Alert
            style={{ marginBottom: '32px' }}
            type="info"
            showIcon
            message={`Last pumping: ${dayjs(sortedPumpings[0].date).fromNow()}`}
          />
        )}
        <div style={{ textAlign: 'center' }}>
          <Button
            style={{ marginBottom: '32px' }}
            type="primary"
            block
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add pumping
          </Button>
          <Input
            style={{ marginBottom: '8px' }}
            type="date"
            value={dayjs(filterDate).format(format)}
            onChange={(e) => setFilterDate(dayjs(e.target.value, format))}
          />
          {filteredPumpings[0] && (
            <>
              <Typography.Title style={{ marginBottom: '8px' }} level={4}>
                Daily pumpings total:{' '}
                {filteredPumpings.reduce(
                  (p, c) => p + (c.session_amount_oz || 0),
                  0,
                )}{' '}
                oz.
              </Typography.Title>
              <PumpingsTimeline>
                {filteredPumpings.map((pumping) => (
                  <PumpingsTimeline.Element
                    key={pumping.id}
                    date={pumping.date}
                    amount={pumping.session_amount_oz}
                    onClick={() => setIsEditModalOpen(pumping)}
                  />
                ))}
              </PumpingsTimeline>
            </>
          )}
        </div>
        <Modal
          title="There's been a pumping!"
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
        >
          <PumpingForm
            onSubmit={(data) => {
              firebase.firestore().collection(DATABASES.PUMPINGS).add(data);

              setIsCreateModalOpen(false);
            }}
          />
        </Modal>
        <Modal
          title="There was a pumping!"
          isOpen={Boolean(isEditModalOpen)}
          onClose={() => {
            setIsEditModalOpen(null);
          }}
        >
          <PumpingForm
            initial={isEditModalOpen}
            onSubmit={(data) => {
              firebase
                .firestore()
                .collection(DATABASES.PUMPINGS)
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
