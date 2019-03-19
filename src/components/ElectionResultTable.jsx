import React from 'react';
import PropTypes from 'prop-types';
import PartyWithResult from '../models/PartyWithResult';
import PartyColorMark from './PartyColorMark';
import './ElectionResultTable.css';
import Party, { REMAINDER_PARTY_NAME } from '../models/Party';

const propTypes = {
  className: PropTypes.string,
  sortedParties: PropTypes.arrayOf(PropTypes.instanceOf(PartyWithResult)),
};
const defaultProps = {
  className: '',
  sortedParties: [],
};

class ElectionResultTable extends React.Component {
  renderTable(parties) {
    const { className } = this.props;

    return (
      <table className={`${className} election-result-table`}>
        <tbody>
          {parties.map(p => (
            <tr key={p.party.name} className="table table-sm">
              <td>
                <PartyColorMark radius={4} color={p.party.color} />
              </td>
              <td className="party-name">{p.party.name}</td>
              <td style={{ textAlign: 'right' }}>{p.seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    const { sortedParties } = this.props;

    const partiesSortedBySeats = sortedParties.concat().sort((a, b) => {
      if (a.party.name === REMAINDER_PARTY_NAME) {
        return 1;
      } else if (b.party.name === REMAINDER_PARTY_NAME) {
        return -1;
      }

      return b.seats - a.seats;
    });
    const half = partiesSortedBySeats.length / 2;

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-auto">{this.renderTable(partiesSortedBySeats.slice(0, half))}</div>
          <div className="col">
            {this.renderTable(partiesSortedBySeats.slice(half, partiesSortedBySeats.length))}
          </div>
        </div>
      </div>
    );
  }
}

ElectionResultTable.propTypes = propTypes;
ElectionResultTable.defaultProps = defaultProps;

export default ElectionResultTable;
