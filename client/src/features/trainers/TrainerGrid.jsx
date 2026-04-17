export const TrainerGrid = ({ trainers = [] }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {trainers.map((trainer) => (
      <article key={trainer.id} className="glass-card overflow-hidden">
        <img src={trainer.imageUrl} alt={trainer.user.firstName} className="h-72 w-full object-cover" />
        <div className="space-y-4 p-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {trainer.user.firstName} {trainer.user.lastName}
            </h3>
            <p className="mt-2 text-sm font-semibold text-court-700">{trainer.headline}</p>
          </div>
          <p className="text-sm leading-7 text-slate-600">{trainer.bio}</p>
          <div className="flex flex-wrap gap-2">
            {trainer.specialties.split(",").map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {item.trim()}
              </span>
            ))}
          </div>
          <div className="text-sm text-slate-500">{trainer.yearsExperience} yıl deneyim</div>
        </div>
      </article>
    ))}
  </div>
);
