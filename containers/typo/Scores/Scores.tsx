import { useMachine } from '@xstate/react'
import { Table } from 'antd'
import { columns } from './columns'
import { scoresMachine } from './scoresMachine'
import styles from './styles.module.scss'

export function Scores() {
  const [state] = useMachine(scoresMachine)

  return (
    <div className={styles.styles}>
      <h4>Scores</h4>
      <Table
        columns={columns}
        dataSource={state.context.scores}
        rowKey="userHandle"
        style={{ marginTop: '1rem' }}
      />
    </div>
  )
}
