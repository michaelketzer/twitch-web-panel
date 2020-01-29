import 'semantic-ui-css/semantic.min.css'
import ReactOnRails from "react-on-rails";
import PanelApp from "./PanelApp/Entry";
import Authorization from "./Auhtorization/Entry";
import FeedOverlay from "./FeedOverlay/Entry";
import BetOverlay from "./BetOverlay/Entry";
import Social from "./Social/Entry";
import Verify from "./Verify/Entry";


ReactOnRails.register({ PanelApp, Authorization, FeedOverlay, BetOverlay, Verify, Social });