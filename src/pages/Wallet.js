import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchCurrencies,
  fetchRates,
  deleteExpense,
  toggleEdit,
  editExpense,
} from '../actions';
import Header from '../components/Header';
import Valor from '../components/Valor';
import Description from '../components/Description';
import Currency from '../components/Currency';
import Method from '../components/Method';
import Tag from '../components/Tag';
import Table from '../components/Table';
import '../CSS/Wallet.css';

const INITIAL_STATE = {
  description: '',
  tag: 'Alimentação',
  method: 'Dinheiro',
  value: '',
  currency: 'USD',
};

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = INITIAL_STATE;
    this.handleChange = this.handleChange.bind(this);
    this.addToExpenses = this.addToExpenses.bind(this);
    this.deleteFromExpenses = this.deleteFromExpenses.bind(this);
    this.addEditedToExpenses = this.addEditedToExpenses.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
  }

  componentDidMount() {
    const { renderCurrencies } = this.props;
    renderCurrencies();
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  addToExpenses() {
    const { addExpenseChange } = this.props;
    addExpenseChange(this.state);
    this.setState({ ...INITIAL_STATE });
  }

  deleteFromExpenses(id) {
    const { deleteExpenseChange } = this.props;
    deleteExpenseChange(id);
  }

  handleToggleEdit(id) {
    const { toggleEditChange, expenses } = this.props;
    const expense = expenses.find((getExpense) => getExpense.id === id);
    const { description, tag, method, value, currency } = expense;
    toggleEditChange(id);
    this.setState({ description, tag, method, value, currency });
  }

  addEditedToExpenses(id) {
    const { editExpenseChange } = this.props;
    editExpenseChange(this.state, id);
    this.setState({ ...INITIAL_STATE });
  }

  render() {
    const { email, currencies, loading, expenses, editing } = this.props;
    const { value, description, currency, method, tag } = this.state;
    return (
      <div>
        <Header email={ email } expenses={ expenses } />
        <form>
          <Valor value={ value } handleChange={ this.handleChange } />
          <Description description={ description } handleChange={ this.handleChange } />
          <Currency
            currency={ currency }
            currencies={ currencies }
            loading={ loading }
            handleChange={ this.handleChange }
          />
          <Method method={ method } handleChange={ this.handleChange } />
          <Tag tag={ tag } handleChange={ this.handleChange } />
          { editing !== 'none' ? (
            <button
              type="button"
              onClick={ () => this.addEditedToExpenses(editing) }
            >
              Editar despesa
            </button>)
            : (
              <button
                type="button"
                onClick={ this.addToExpenses }
              >
                Adicionar Despesa
              </button>) }
        </form>
        <Table
          expenses={ expenses }
          deleteFromExpenses={ this.deleteFromExpenses }
          handleToggleEdit={ this.handleToggleEdit }
        />
      </div>);
  }
}

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool.isRequired,
  renderCurrencies: PropTypes.func.isRequired,
  addExpenseChange: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteExpenseChange: PropTypes.func.isRequired,
  editing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  toggleEditChange: PropTypes.func.isRequired,
  editExpenseChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
  loading: state.wallet.loading,
  expenses: state.wallet.expenses,
  editing: state.wallet.editing,
});

const mapDispatchToProps = (dispatch) => ({
  renderCurrencies: () => dispatch(fetchCurrencies()),
  addExpenseChange: (payload) => dispatch(fetchRates(payload)),
  deleteExpenseChange: (payload) => dispatch(deleteExpense(payload)),
  toggleEditChange: (id) => dispatch(toggleEdit(id)),
  editExpenseChange: (state, id) => dispatch(editExpense(state, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
