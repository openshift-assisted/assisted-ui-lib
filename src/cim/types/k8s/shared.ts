export type StatusCondition<ConditionType> = {
  lastTransitionTime: string;
  message: string;
  reason: string;
  status: 'True' | 'False' | 'Unknown';
  type: ConditionType;
};

export type K8sPatch = {
  op: 'replace' | 'add';
  path: string;
  value: object | string;
}[];
