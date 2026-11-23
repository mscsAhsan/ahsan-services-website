import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container page-top notfound">
      <div className="nf-num">404</div>
      <h2 className="h2">This page got lost in the network</h2>
      <Link to="/" className="btn btn-primary"><ArrowLeft size={18} /> Back home</Link>
    </div>
  );
}
