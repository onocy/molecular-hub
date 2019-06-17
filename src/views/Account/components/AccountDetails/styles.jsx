export default theme => ({
  root: {},
  field: {
    margin: theme.spacing.unit * 3
  },
  textField: {
    width: '420px',
    maxWidth: '100%',
    marginRight: theme.spacing.unit * 3
  },
  portletFooter: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  keyDivider: {
    marginTop: theme.spacing.unit * 2, 
    marginBottom: theme.spacing.unit * 2
  }, 
  keyValue: {
    color: 'red'
  }
});
