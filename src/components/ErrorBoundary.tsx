import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: "20px",
                    fontFamily: "system-ui, sans-serif",
                    maxWidth: "600px",
                    margin: "50px auto",
                    background: "#FEF2F2",
                    border: "1px solid #F87171",
                    borderRadius: "8px",
                    color: "#991B1B"
                }}>
                    <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Something went wrong</h1>
                    <p style={{ marginBottom: "20px" }}>The application crashed with the following error:</p>
                    <pre style={{
                        background: "white",
                        padding: "15px",
                        borderRadius: "4px",
                        overflow: "auto",
                        border: "1px solid #FECACA"
                    }}>
                        {this.state.error?.message}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            background: "#DC2626",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
