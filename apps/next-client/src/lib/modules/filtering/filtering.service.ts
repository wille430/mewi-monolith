import {ISortable} from "@/lib/modules/filtering/ISortable"
import {IPagination} from "@/lib/modules/filtering/IPagination"
import {PipelineStage} from "mongoose"
import {autoInjectable} from "tsyringe"


@autoInjectable()
export class FilteringService {
    public applySort(obj: ISortable, pipeline: PipelineStage[]): void {
        if (obj.sort) {
            pipeline.push({
                $sort: obj.sort
            })
        }
    }

    public applyPagination(obj: IPagination, pipeline: PipelineStage[]): void {
        if (obj.limit != null) {
            pipeline.push({
                $skip: ((obj.page ?? 1) - 1) * obj.limit
            })
            pipeline.push({
                $limit: obj.limit
            })
        }
    }
}