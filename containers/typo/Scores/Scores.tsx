import { useMachine } from '@xstate/react'
import { Table } from 'antd'
import { columns } from './columns'
import { scoresMachine, State } from './scoresMachine'
import styles from './styles.module.scss'

export function Scores() {
  const [state] = useMachine(scoresMachine)

  return (
    <div className={styles.styles}>
      <h4>Scores {state.value}</h4>
      <Table
        columns={columns}
        dataSource={state.context.scores}
        rowKey="userHandle"
        loading={state.matches(State.fetchingScores)}
      />
    </div>
  )
}
