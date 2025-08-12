import SkinZAIHeader from '../components/SkinZAIHeader';
import DemoTour from '../components/DemoTour';

export default function Page() {
  return (
    <div>
      <SkinZAIHeader />
      <div className="sz-card">
        <h2>Welcome</h2>
        <p>Use the left nav or header to jump into the demo flow.</p>
      </div>
      <DemoTour />
    </div>
  );
}
