import { Component } from 'react';
import Link from 'next/link';

class Home extends Component {
    render() {
        return (
            <div style={{
                paddingTop: '100px',
                textAlign: 'center',
                color: '#98AFC7'
            }}>
                <h1>Welcome to the next.js Weather App</h1>
                <p>
                    Click{' '}
                    <Link href="/weather">
                        <a style={{ color: '#C7B097', textDecoration: 'none' }}>here</a>
                    </Link>
                    {' '}for today's hourly forecast.
                </p>
            </div>
        );
    }
}

export default Home;
