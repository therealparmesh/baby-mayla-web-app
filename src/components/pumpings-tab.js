import { useState, useEffect } from 'preact/hooks';
import { Alert, Button, Input } from 'antd';
import { Modal } from './modal';
import { PumpingsTimeline } from './pumpings-timeline';
import { PumpingForm } from './pumping-form';
import { dayjs } from '../core/dayjs';
import { firebase } from '../core/firebase';
import { DATABASES } from '../core/constants';

export const PumpingsTab = () => {
  const [filterDate, setFilterDate] = useState(dayjs());
  const [pumpings, setPumpings] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(DATABASES.PUMPINGS)
      .onSnapshot(({ docs }) =>
        setPumpings(docs.map(doc => ({ ...doc.data(), id: doc.id }))),
      );

    return unsubscribe;
  }, []);

  const sortedPumpings = [...(pumpings || [])].sort((a, b) => b.date - a.date);

  const filteredPumpings = sortedPumpings.filter(
    pumping =>
      pumping.date >=
        filterDate
          .startOf('day')
          .toDate()
          .getTime() &&
      pumping.date <=
        filterDate
          .endOf('day')
          .toDate()
          .getTime(),
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
            message="Last pumping"
            description={dayjs(sortedPumpings[0].date).fromNow()}
          />
        )}
        <div style={{ textAlign: 'center' }}>
          <Button
            style={{ marginBottom: '32px' }}
            type="primary"
            block
            onClick={() => setIsModalOpen(true)}
          >
            Add pumping
          </Button>
          <Input
            style={{ marginBottom: '8px' }}
            type="date"
            value={dayjs(filterDate).format(format)}
            onChange={e => setFilterDate(dayjs(e.target.value, format))}
          />
          {filteredPumpings[0] && (
            <PumpingsTimeline>
              {filteredPumpings.map(pumping => (
                <PumpingsTimeline.Element
                  date={pumping.date}
                  amount={pumping.session_amount_oz}
                />
              ))}
            </PumpingsTimeline>
          )}
        </div>
        <Modal
          title="There's been a pumping!"
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <PumpingForm
            onSubmit={data => {
              firebase
                .firestore()
                .collection(DATABASES.PUMPINGS)
                .add(data);

              setIsModalOpen(false);
            }}
          />
        </Modal>
      </>
    )
  );
};
