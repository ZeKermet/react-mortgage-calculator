import styles from './MortgageCalculator.module.css';
import React, {useState, useContext, createContext} from 'react';
import EmptyIcon from '/project-assets/assets/images/illustration-empty.svg';
import CalculatorIcon from '/project-assets/assets/images/icon-calculator.svg';


export default function MortgageCalculator() {
    const [principal, setPrincipal] = useState("undefined");
    const [term, setTerm] = useState("undefined");
    const [interest, setInterest] = useState("undefined");
    const [selectedMortgateType, setSelectedMortgageType] = useState("Repayment");
    const [mortgageType, setMortgageType] = useState(selectedMortgateType);

    const allValuesEntered = () => {
        return (interest !== "undefined" && term !== "undefined" && principal !== "undefined")
    }

    const handleClearAll = () => {
        for (const inputContainer of document.getElementsByClassName(styles.numberInput)) {
            inputContainer.getElementsByTagName("input")[0].value = "";
        }
    }

    const handleFocus = (e) => {
        e.target.parentElement.classList.add(styles.focused);

        if (e.target.classList.contains(styles.principal)) {
            const numberString = ("" + e.target.value).replace(",", "");
            e.target.value = numberString;
        }
    }

    const handleUnfocus = (e) => {
        e.target.parentElement.classList.remove(styles.focused);

        if (e.target.classList.contains(styles.principal)) {
            e.target.value = formatPrice(e.target.value);
        }

        if (e.target.parentElement.parentElement.classList.contains(styles.error)) {
            e.target.parentElement.parentElement.classList.remove(styles.error);
        }
    }

    const handleCalculate = () => {
        const principalInput = document.getElementsByClassName(styles.principal)[0];
        const termInput = document.getElementsByClassName(styles.term)[0];
        const interestInput = document.getElementsByClassName(styles.interest)[0];
        const tempMortgageType = selectedMortgateType;

        if (principalInput.value !== "" && termInput.value !== "0" && termInput.value !== "" && interestInput.value !== "") {
            setPrincipal(parseFloat(("" + principalInput.value).replace(",", "")));
            setTerm(termInput.value);
            setInterest(interestInput.value);
            setMortgageType(tempMortgageType);
        } else {
            const inputsList = [principalInput, termInput, interestInput];
            for (const input of inputsList) {
                if (input.value === "") {
                    input.parentElement.parentElement.classList.add(styles.error);
                }
            }
            if (termInput.value === "0") {
                termInput.parentElement.parentElement.classList.add(styles.error);
            }
        }
    }

    return (
        <div className={styles.mortgageCalculator}>
            <div className={styles.numberInputColumn}>
                <div className={styles.colTop}>
                    <h2>Mortgage Calculator</h2>
                    <a className={`p-small ${styles.clearAllValue}`} onClick={handleClearAll}>Clear All</a>
                </div>

                <div className={styles.mortgageInputs}>
                    <div className={styles.numberInput}>
                        <p className={styles.inputLabel}>Mortgage Amount</p>
                        <div className={`${styles.numberInputContainer} ${styles.dollar}`}>
                        <div className={`${styles.inputUnit}`}>$</div>
                            <input className={styles.principal} onFocus={handleFocus} onBlur={handleUnfocus} />
                        </div>
                        <p className={styles.errorText}>This field is required</p>
                    </div>

                    <div className={styles.numberInput}>
                        <p className={styles.inputLabel}>Mortgage Term</p>
                        <div className={styles.numberInputContainer}>
                            <input className={styles.term} type="number" onFocus={handleFocus} onBlur={handleUnfocus} />
                            <div className={styles.inputUnit}>years</div>
                        </div>
                        <p className={styles.errorText}>This cannot be 0 or empty</p>
                    </div>

                    <div className={styles.numberInput}>
                        <p className={styles.inputLabel}>Interest Rate</p>
                        <div className={styles.numberInputContainer}>
                            <input className={styles.interest} type="number" onFocus={handleFocus} onBlur={handleUnfocus} />
                            <div className={styles.inputUnit}>%</div>
                        </div>
                        <p className={styles.errorText}>This field is required</p>
                    </div>

                    <div className={styles.selectInput}>
                        <p className={styles.inputLabel}>Mortgage Type</p>
                        <div className={styles.selectInputContainer}>
                            <div 
                                onClick={() => {selectedMortgateType !== "Repayment" ? setSelectedMortgageType("Repayment") : ""}}
                                className={`${styles.selectOption} ${selectedMortgateType === 'Repayment' ? styles.active : ''}`}
                            >
                                <div className={styles.selectCircle}></div>
                                <p>Repayment</p>
                            </div>
                            <div 
                                onClick={() => {selectedMortgateType !== "Interest" ? setSelectedMortgageType("Interest") : ""}}
                                className={`${styles.selectOption} ${selectedMortgateType === 'Interest' ? styles.active : ''}`}
                            >
                                <div className={styles.selectCircle}></div>
                                <p>Interest Only</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button className={styles.calculateBtn} onClick={handleCalculate}><img src={CalculatorIcon} /> Calculate Repayments</button>
            </div>

            <div className={styles.resultsColumn}>
                {allValuesEntered() ? (
                    <>
                        <div className={styles.colTop}>
                            <h2>Your results</h2>
                        </div>

                        <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "calculate repayments" again.</p>

                        <div className={styles.resultsContainer}>
                            <div>
                                <div className={styles.result}>
                                    {mortgageType === "Repayment" ? (
                                        <>
                                            <p>Your monthly repayments</p>
                                            <h1>${formatPrice(calculateMonthlyRepayment(principal, interest, term))}</h1>
                                        </>
                                    ) : (
                                        <>
                                            <p>Your monthly Interest</p>
                                            <h1>${formatPrice(calculateMonthlyInterest(calculateMonthlyRepayment(principal, interest, term), principal/(term*12)))}</h1>
                                        </>
                                    )}
                                </div>
                                <hr size="1" />
                                <div className={styles.result}>
                                {mortgageType === "Repayment" ? (
                                        <>
                                            <p>Total you'll repay over the term</p>
                                            <h2>${formatPrice(calculateMonthlyRepayment(principal, interest, term) * term*12)}</h2>
                                        </>
                                    ) : (
                                        <>
                                            <p>Total interest you'll pay over the term</p>
                                            <h2>${formatPrice(calculateMonthlyInterest(calculateMonthlyRepayment(principal, interest, term), principal/(term*12)) * term*12)}</h2>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyResultsContainer}>
                        <img src={EmptyIcon} />
                        <h2>Results shown here</h2>
                        <p className="p-small">Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
                    </div>
                )}
            </div>            
        </div>
    );
}

function formatPrice(num) {
    return new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(num);
}

function calculateMonthlyRepayment(principal, interest, term) {
    interest = (interest/100)/12;
    term = term*12;
    return principal * ((interest * (1 + interest)**(term))/((1 + interest)**(term) - 1));
}

function calculateMonthlyInterest(calculatedRepayment, monthlyPrincipalPayment) {
    return calculatedRepayment - monthlyPrincipalPayment;
}