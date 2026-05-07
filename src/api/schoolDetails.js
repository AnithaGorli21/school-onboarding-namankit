import { apiFetch, apiPatch, apiPost } from "./liferay";

export const getSchoolDetails = (schoolProfileId) =>
  apiFetch(
    `/o/c/schooldetailses?filter=schoolProfileId eq ${schoolProfileId}&pageSize=1000`,
  ).then((d) => (d.items || []) || null);
export const getAllSchoolDetails = () =>
  apiFetch(
    `/o/c/schooldetailses`,
  ).then((d) => (d.items || []) || null);
  export const saveSchoolDetails = (payload) =>
    apiPost("/o/c/schooldetailses", payload);
  export const patchSchoolDetails  = (id, payload) =>
    apiPatch(`/o/c/schooldetailses/${id}`, payload);