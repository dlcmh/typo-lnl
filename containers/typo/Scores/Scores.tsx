import { useMachine } from '@xstate/react'
import { Table } from 'antd'
import { columns } from './columns'
import { scoresMachine, State } from './scoresMachine'
import styles from './styles.module.scss'

export function Scores() {
  const [state] = useMachine(scoresMachine)

  return (
    <div className={styles.styles}>
      <h4>Scores (scoresMachine {state.value})</h4>
      <Table
        pagination={{ defaultPageSize: 50 }}
        columns={columns}
        dataSource={state.context.scores}
        rowKey="userHandle"
        loading={state.matches(State.fetchingScores)}
        scroll={{ y: '50vh' }}
      />
    </div>
  )
}
