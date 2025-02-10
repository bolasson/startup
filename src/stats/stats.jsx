import React from "react";
import "../styles.css";

export default function Stats() {
    return (
        <main>
            <section className="intro">
                <h2>Statistics for Bryce</h2>
                <table className="rounded-table">
                    <tbody>
                        {/* <!-- This will be populated with data from the database. --> */}
                        <tr>
                            <td>Games Played</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td>Games Won</td>
                            <td>20</td>
                        </tr>
                        <tr>
                            <td>Total Points Scored</td>
                            <td>1,200</td>
                        </tr>
                        <tr>
                            <td>Date Joined</td>
                            <td>01-23-2025</td>
                        </tr>
                        <tr>
                            <td>Last Played</td>
                            <td>02-01-2025</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>
    );
}