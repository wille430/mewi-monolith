import { RunPipelineEvent } from '../../events/run-pipeline.event'

export const runPipelineEventStub = (): RunPipelineEvent => ({
    count: 1,
    start: 1,
    verbose: false,
})
