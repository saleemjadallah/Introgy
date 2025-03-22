import UIKit
import SwiftUI

class SocialBatteryView: UIView {
    // MARK: - Properties
    private let batteryLevel: CGFloat
    private let batteryWidth: CGFloat = 60
    private let batteryHeight: CGFloat = 28
    private let capWidth: CGFloat = 4
    
    private lazy var batteryContainer: UIView = {
        let view = UIView()
        view.backgroundColor = .clear
        view.layer.borderWidth = 2
        view.layer.borderColor = DesignSystem.Colors.text.cgColor
        view.layer.cornerRadius = batteryHeight / 4
        return view
    }()
    
    private lazy var batteryFill: UIView = {
        let view = UIView()
        view.layer.cornerRadius = (batteryHeight - 6) / 4
        return view
    }()
    
    private lazy var batteryCap: UIView = {
        let view = UIView()
        view.backgroundColor = DesignSystem.Colors.text
        view.layer.cornerRadius = 2
        return view
    }()
    
    // MARK: - Initialization
    init(level: CGFloat) {
        self.batteryLevel = min(max(level, 0), 1)
        super.init(frame: .zero)
        setupViews()
    }
    
    required init?(coder: NSCoder) {
        self.batteryLevel = 1
        super.init(coder: coder)
        setupViews()
    }
    
    // MARK: - Setup
    private func setupViews() {
        addSubview(batteryContainer)
        batteryContainer.addSubview(batteryFill)
        addSubview(batteryCap)
        
        setupConstraints()
        updateBatteryColor()
    }
    
    private func setupConstraints() {
        batteryContainer.translatesAutoresizingMaskIntoConstraints = false
        batteryFill.translatesAutoresizingMaskIntoConstraints = false
        batteryCap.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            // Battery container
            batteryContainer.leadingAnchor.constraint(equalTo: leadingAnchor),
            batteryContainer.centerYAnchor.constraint(equalTo: centerYAnchor),
            batteryContainer.widthAnchor.constraint(equalToConstant: batteryWidth),
            batteryContainer.heightAnchor.constraint(equalToConstant: batteryHeight),
            
            // Battery fill
            batteryFill.leadingAnchor.constraint(equalTo: batteryContainer.leadingAnchor, constant: 3),
            batteryFill.topAnchor.constraint(equalTo: batteryContainer.topAnchor, constant: 3),
            batteryFill.bottomAnchor.constraint(equalTo: batteryContainer.bottomAnchor, constant: -3),
            batteryFill.widthAnchor.constraint(equalTo: batteryContainer.widthAnchor, multiplier: batteryLevel, constant: -6),
            
            // Battery cap
            batteryCap.leadingAnchor.constraint(equalTo: batteryContainer.trailingAnchor),
            batteryCap.centerYAnchor.constraint(equalTo: batteryContainer.centerYAnchor),
            batteryCap.widthAnchor.constraint(equalToConstant: capWidth),
            batteryCap.heightAnchor.constraint(equalTo: batteryContainer.heightAnchor, multiplier: 0.4)
        ])
    }
    
    private func updateBatteryColor() {
        let color: UIColor
        
        switch batteryLevel {
        case 0.0...0.3:
            color = DesignSystem.Colors.batteryLow
        case 0.3...0.6:
            color = DesignSystem.Colors.batteryMedium
        default:
            color = DesignSystem.Colors.batteryFull
        }
        
        batteryFill.backgroundColor = color
    }
    
    // MARK: - Public Methods
    func updateLevel(_ level: CGFloat, animated: Bool = true) {
        let newLevel = min(max(level, 0), 1)
        
        if animated {
            UIView.animate(withDuration: DesignSystem.Animations.standardDuration) {
                self.batteryFill.transform = CGAffineTransform(scaleX: newLevel, y: 1)
                self.updateBatteryColor()
            }
        } else {
            batteryFill.transform = CGAffineTransform(scaleX: newLevel, y: 1)
            updateBatteryColor()
        }
    }
}

// MARK: - SwiftUI Preview
struct SocialBatteryView_Preview: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            SocialBatteryViewRepresentable(level: 1.0)
                .frame(width: 80, height: 40)
            
            SocialBatteryViewRepresentable(level: 0.5)
                .frame(width: 80, height: 40)
            
            SocialBatteryViewRepresentable(level: 0.2)
                .frame(width: 80, height: 40)
        }
        .padding()
        .previewLayout(.sizeThatFits)
    }
}

struct SocialBatteryViewRepresentable: UIViewRepresentable {
    let level: CGFloat
    
    func makeUIView(context: Context) -> SocialBatteryView {
        return SocialBatteryView(level: level)
    }
    
    func updateUIView(_ uiView: SocialBatteryView, context: Context) {
        uiView.updateLevel(level, animated: false)
    }
}
