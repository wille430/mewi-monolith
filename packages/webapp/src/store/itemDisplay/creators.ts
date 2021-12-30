import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import searchApi from "api/searchApi";
import { ItemDisplayActionTypes } from "./types";

export const getItem = createAsyncThunk(ItemDisplayActionTypes.GET_ITEM, async (itemId: string, thunkApi) => {
    try {
        const item = await searchApi.getItemById(itemId)
        return item
    } catch (e) {
        return thunkApi.rejectWithValue(e)
    }
})

export const clearItem = createAction(ItemDisplayActionTypes.CLEAR_ITEM)