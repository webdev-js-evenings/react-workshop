
export const snapShotToArray = snapshot => {
  const val = snapshot.val() || {}
  return Object.keys(val).map(id => {
    return {
      ...val[id],
      _id: id
    }
  })
}
