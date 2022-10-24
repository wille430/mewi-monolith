import type { RunPipelineEvent } from '@/scrapers/events/run-pipeline.event'

export const runPipelineEventStub = (): RunPipelineEvent => ({
    count: 1,
    start: 1,
    verbose: false,
})
