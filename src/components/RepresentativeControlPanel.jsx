import React from 'react';
import PropTypes from 'prop-types';
import { keyBy } from 'lodash';
import ElectionResult from '../models/ElectionResult';
import presets from '../data/electionResults';
import SeatInput from './SeatInput';
import electionResults from '../data/electionResults';
import { REMAINDER_PARTY_NAME } from '../models/Party';

const presetLookup = keyBy(presets, p => p.key);

const propTypes = {
  className: PropTypes.string,
};
const defaultProps = {
  className: '',
};

class RepresentativeControlPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    const preset = presets[0].key;
    this.state = {
      preset,
      result: new ElectionResult(presetLookup[preset].result),
    };
    this.handlePresetChange = this.handlePresetChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handlePresetChange(ev) {
    const { result } = this.state;
    const preset = ev.target.value;
    this.setState({
      preset,
      result:
        preset === 'CUSTOM' ? result.clone() : new ElectionResult(presetLookup[preset].result),
    });
  }

  handleInputChange() {}

  render() {
    const { className } = this.props;
    const { preset, result } = this.state;

    const half = Math.ceil(result.partyWithResults.length / 2);
    const sortedParties = result.partyWithResults.sort((a, b) => {
      if (a.party.name === REMAINDER_PARTY_NAME) {
        return 1;
      } else if (b.party.name === REMAINDER_PARTY_NAME) {
        return -1;
      }

      return a.party.name.localeCompare(b.party.name);
    });
    const halves = [sortedParties.slice(0, half), sortedParties.slice(half)];

    return (
      <div className={className}>
        <div className="input-group">
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="inputGroupSelect01">
              ใช้ตัวเลขจาก
            </label>
          </div>
          <select className="custom-select" onChange={this.handlePresetChange}>
            {presets.map(rs => (
              <option value={rs.key} key={rs.key} selected={rs.key === preset}>
                {rs.name}
              </option>
            ))}
            <option value="CUSTOM">กำหนดเอง</option>
          </select>
        </div>
        <p>
          <small>
            (สามารถปรับตัวเลขได้ตามใจชอบ โดยกดที่ช่องตัวเลขแล้วพิมพ์ หรือ ใช้ปุ่มเพิ่ม/ลด)
          </small>
        </p>
        <p />
        <div className="container">
          <div className="row">
            {halves.map((parties, i) => (
              <div className="col" key={`half-${i}`}>
                <div className="form">
                  {parties.map(p => (
                    <div key={p.party.name} className="form-group row">
                      <label className="col col-form-label col-form-label-sm">{p.party.name}</label>
                      <div className="col-md-auto">
                        <SeatInput
                          value={p.seats}
                          onValueChange={value => {
                            this.setState({
                              preset: 'custom',
                              result: result.cloneAndUpdateSeats(p.party.name, value),
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

RepresentativeControlPanel.propTypes = propTypes;
RepresentativeControlPanel.defaultProps = defaultProps;

export default RepresentativeControlPanel;
